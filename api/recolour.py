"""
recolour.py — Smart automotive colour-changer

Two modes:
  A. With BG removal  → Photoroom API strips background first → recolour on clean PNG
  B. In-place         → No API call, recolour directly on original image

Protection system (in-place mode):
  1. Logo zone        — Green ETi3 logo detected and dilated to protect adjacent text/graphics
  2. Near-white       — White text, livery decals preserved
  3. Near-black       — Dark trim, tyre walls, carbon fibre texture preserved
  4. Floor/shadow     — Bounding-box-based bottom fade zone for ground shadows and reflections

Works with: full cars, bumpers, diffusers, spoilers, splitters,
            carbon fibre parts, primed parts, painted individual parts.
"""

import os
import base64
import requests
import numpy as np
import cv2
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

API_KEY      = os.getenv("PHOTOROOM_API_KEY", "")
PR_ENDPOINT  = "https://image-api.photoroom.com/v2/edit"


# ── Photoroom: remove background ──────────────────────────────────────────────

def remove_background(image_bytes: bytes, filename: str = "image.jpg") -> tuple:
    """Call Photoroom v2 API to strip the background."""
    mime = "image/png" if filename.lower().endswith(".png") else "image/jpeg"
    try:
        resp = requests.post(
            PR_ENDPOINT,
            headers={"x-api-key": API_KEY},
            data={"background.mode": "transparent", "referenceBox": "originalImage"},
            files={"imageFile": (filename, image_bytes, mime)},
            timeout=40,
        )
    except requests.exceptions.Timeout:
        return None, "Photoroom API timeout (>40s)"
    except Exception as e:
        return None, f"Network error: {e}"

    if resp.status_code == 200:
        return resp.content, None
    return None, f"Photoroom API {resp.status_code}: {resp.text[:200]}"


# ── Colour utilities ───────────────────────────────────────────────────────────

def hex_to_bgr_hsv(hex_color: str) -> tuple:
    """Parse a #RRGGBB hex string → (hue_cv, sat_cv, val_cv) in OpenCV ranges."""
    h = hex_color.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    pixel = np.array([[[b, g, r]]], dtype=np.uint8)
    hsv   = cv2.cvtColor(pixel, cv2.COLOR_BGR2HSV)[0, 0]
    return float(hsv[0]), float(hsv[1]), float(hsv[2])


def find_dominant_hue(img_hsv: np.ndarray, subject_mask: np.ndarray) -> float:
    """Return the most common hue (0-179) among colourful, mid-bright pixels."""
    h, s, v = img_hsv[:, :, 0], img_hsv[:, :, 1], img_hsv[:, :, 2]
    mask = subject_mask & (s > 40) & (v > 45) & (v < 235)
    if mask.sum() < 200:
        return 0.0

    hues     = h[mask].astype(np.int32)
    hist     = np.bincount(hues, minlength=180).astype(np.float64)
    pad      = 10
    padded   = np.concatenate([hist[-pad:], hist, hist[:pad]])
    kernel   = np.ones(pad * 2 + 1) / (pad * 2 + 1)
    smoothed = np.convolve(padded, kernel, mode="valid")
    return float(np.argmax(smoothed[:180]))


# ── Bounding box & segmentation utilities ──────────────────────────────────────

def get_grabcut_mask(img_bgr: np.ndarray) -> np.ndarray:
    """Generate a foreground subject mask using OpenCV GrabCut."""
    h, w = img_bgr.shape[:2]
    # Downscale for performance
    scale_w = 350
    scale_h = int(h * (scale_w / w))
    img_small = cv2.resize(img_bgr, (scale_w, scale_h))

    mask_gc = np.zeros(img_small.shape[:2], dtype=np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    # Margins: assume product is centered. Use a tight 1.0% margin to prevent cutting off splitters/bumper edges.
    margin_w = max(1, int(scale_w * 0.01))
    margin_h = max(1, int(scale_h * 0.01))
    rect = (margin_w, margin_h, scale_w - 2 * margin_w, scale_h - 2 * margin_h)

    try:
        cv2.grabCut(img_small, mask_gc, rect, bgdModel, fgdModel, 3, cv2.GC_INIT_WITH_RECT)
        fg_mask_small = np.where((mask_gc == 1) | (mask_gc == 3), 255, 0).astype(np.uint8)

        # Close holes and clean up edges
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        fg_mask_small = cv2.morphologyEx(fg_mask_small, cv2.MORPH_CLOSE, kernel)
        fg_mask_small = cv2.morphologyEx(fg_mask_small, cv2.MORPH_OPEN, kernel)
    except Exception:
        # Fallback: assume center area is foreground
        fg_mask_small = np.zeros(img_small.shape[:2], dtype=np.uint8)
        fg_mask_small[margin_h:-margin_h, margin_w:-margin_w] = 255

    # Upscale back to original resolution
    fg_mask = cv2.resize(fg_mask_small, (w, h), interpolation=cv2.INTER_NEAREST)
    return fg_mask > 127


def get_params_for_part(part_type: str) -> dict:
    """Return tuned recolouring settings based on the part name."""
    part = part_type.lower().strip()
    
    # Strict ruling: Default settings assume whole car / car body
    params = {
        "auto_colorize_enabled": True,
        "bottom_fade_pct": 0.0,         # no bottom fade for whole car to avoid cutting off front splitter/rear bumper
        "floor_hard_pct": 0.0,          # no floor hard cutoff for whole car
        "dark_val_max": 24,             # very low to ensure all shadows on car body change color
        "white_val_min": 235,           # protect only extremely bright specular reflections/decals
        "hue_tolerance": 60,            # wider tolerance for whole car to capture shadowed pink/red panel hues
    }

    if not part:
        return params

    # Carbon / unpainted / grey parts (diffusers, spoilers, etc.)
    if any(k in part for k in ["carbon", "grey", "gray", "prime"]):
        params["dark_val_max"] = 28     # protect deep black weave lines, recolour highlights
        params["white_val_min"] = 225
        params["hue_tolerance"] = 60

    # Spoilers & Wings (no floor underneath, recolour whole part)
    if any(k in part for k in ["spoiler", "wing"]):
        params["bottom_fade_pct"] = 0.02
        params["floor_hard_pct"] = 0.0
        params["dark_val_max"] = 24
        params["white_val_min"] = 230
        params["hue_tolerance"] = 60

    # Diffusers, Splitters, Bumpers, Skirts (very close to ground shadows)
    elif any(k in part for k in ["diffuser", "splitter", "bumper", "skirt", "lip"]):
        params["bottom_fade_pct"] = 0.20 # larger fade to blend into ground shadows
        params["floor_hard_pct"] = 0.06
        params["dark_val_max"] = 32      # higher to protect ground shadows
        params["white_val_min"] = 220
        params["hue_tolerance"] = 38     # keep standard to avoid catching wheels/shadows

    return params


# ── Unified recolouring core ──────────────────────────────────────────────────

def recolour_subject(
    img_bgr: np.ndarray,
    subject_mask: np.ndarray,
    target_hex: str,
    colorize_mode: bool = False,
    hue_tolerance: int = 38,
    min_saturation: int = 16,
    sat_blend: float = 0.85,
    part_type: str = "",
) -> tuple:
    """
    Recolour the specified subject mask inside the BGR image.
    Handles logo protection, shadow/reflection preservation, and auto-detects grey/carbon parts.
    """
    h_img, w_img = img_bgr.shape[:2]
    img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    hue_map = img_hsv[:, :, 0]
    sat_map = img_hsv[:, :, 1]
    val_map = img_hsv[:, :, 2]

    # Get tuned parameters for this part type
    params = get_params_for_part(part_type)
    bottom_fade_pct = params["bottom_fade_pct"]
    floor_hard_pct = params["floor_hard_pct"]
    dark_val_max = params["dark_val_max"]
    white_val_min = params["white_val_min"]

    # Use tuned hue_tolerance if default (38) is requested
    if hue_tolerance == 38:
        hue_tolerance = params.get("hue_tolerance", 38)

    # Detect the ETi3 green logo pixels
    # H range [30, 90], S/V >= 60 in OpenCV HSV scale.
    # We apply a 5x5 morphological opening to eliminate any green reflections/noise on the car body
    raw_green_mask = (hue_map >= 30) & (hue_map <= 90) & (sat_map >= 60) & (val_map >= 60)
    kernel_open = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    logo_green_mask = cv2.morphologyEx(raw_green_mask.astype(np.uint8), cv2.MORPH_OPEN, kernel_open) > 0

    # Near-white and near-black thresholds using dynamic parameters
    white_pixels = (val_map > white_val_min) & (sat_map < 48)
    dark_pixels = val_map < dark_val_max

    # 1. Build protection mask
    # A. Logo protection: dilate the cleaned green logo to cover adjacent text
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (11, 11))
    dilated_logo = cv2.dilate(logo_green_mask.astype(np.uint8), kernel) > 0

    # B. Compile all protections
    protection = dilated_logo | white_pixels | dark_pixels

    # Find dominant hue (exclude protected regions from the histogram)
    hist_mask = subject_mask & ~protection
    dominant_hue = find_dominant_hue(img_hsv, hist_mask)
    target_h, target_s, _ = hex_to_bgr_hsv(target_hex)

    # 2. Determine average saturation of the paint surface (excluding logo, white, dark parts)
    sub_sat = sat_map[hist_mask]
    avg_sat = sub_sat.mean() if len(sub_sat) > 0 else 0.0
    auto_colorize = False
    if params["auto_colorize_enabled"] and avg_sat < 35.0:
        colorize_mode = True
        auto_colorize = True

    # 3. Floor bounds relative to subject bounding box
    y_indices, x_indices = np.where(subject_mask)
    if len(y_indices) > 0:
        y_min, y_max = y_indices.min(), y_indices.max()
        h_sub = y_max - y_min + 1
        fade_start_y = y_max - int(bottom_fade_pct * h_sub)
        hard_floor_row = y_max - int(floor_hard_pct * h_sub)
    else:
        y_min, y_max, h_sub = 0, h_img - 1, h_img
        fade_start_y = h_img - 1
        hard_floor_row = h_img - 1

    # Add hard floor exclusion to protection mask
    row_idx = np.broadcast_to(
        np.arange(h_img, dtype=np.int32).reshape(-1, 1),
        (h_img, w_img)
    )
    protection |= (row_idx >= hard_floor_row)

    # 4. Define recolouring mask
    if colorize_mode:
        # Full Surface Colorize (carbon/grey parts): recolour all visible surfaces within brightness limits
        colour_mask = subject_mask & (val_map >= 55) & (val_map <= 245) & ~protection
    else:
        # Smart Shift (painted parts): recolour pixels matching dominant hue
        diff = np.abs(hue_map - dominant_hue)
        diff = np.minimum(diff, 180.0 - diff)
        colour_mask = subject_mask & (diff < hue_tolerance) & (sat_map > min_saturation) & ~protection

    # 5. Apply recolouring
    result_hsv = img_hsv.copy()
    result_hsv[colour_mask, 0] = target_h

    # 6. Apply saturation blending with bottom fade-out
    pixel_y = row_idx[colour_mask]
    pixel_brightness = val_map[colour_mask]

    # Base blend factor: scales down in shadows but keeps a high minimum to prevent washed-out/grey shadows
    min_blend = min(0.55, sat_blend)
    blend_factor = np.clip(
        min_blend + (sat_blend - min_blend) * (pixel_brightness / 200.0),
        min_blend, sat_blend
    )

    # Fade out blending factor as we reach the bottom of the part
    if h_sub > 10 and bottom_fade_pct > 0.0:
        in_fade = pixel_y > fade_start_y
        fade_ratio = (hard_floor_row - pixel_y[in_fade]) / float(hard_floor_row - fade_start_y + 1e-5)
        blend_factor[in_fade] *= np.clip(fade_ratio, 0.0, 1.0)

    orig_s = result_hsv[colour_mask, 1]
    result_hsv[colour_mask, 1] = np.clip(
        orig_s * (1.0 - blend_factor) + target_s * blend_factor, 0, 255
    )

    result_hsv = np.clip(result_hsv, 0, 255).astype(np.uint8)
    result_bgr = cv2.cvtColor(result_hsv, cv2.COLOR_HSV2BGR)

    return result_bgr, {
        "dominant_hue": round(dominant_hue, 1),
        "target_hue": round(target_h, 1),
        "pixels_changed": int(colour_mask.sum()),
        "total_subject_pixels": int(subject_mask.sum()),
        "average_saturation": round(float(avg_sat), 1),
        "auto_colorize": auto_colorize,
        "mode": "colorize" if colorize_mode else "shift",
    }


# ── With-BG-removal recolour ───────────────────────────────────────────────────

def smart_recolour(
    img_bgra: np.ndarray,
    target_hex: str,
    colorize_mode: bool = False,
    part_type: str = "",
    hue_tolerance: int = 38,
    sat_blend: float = 0.85,
) -> tuple:
    """Recolour subject in img_bgra (transparent bg) to target_hex."""
    if img_bgra.shape[2] != 4:
        img_bgra = cv2.cvtColor(img_bgra, cv2.COLOR_BGR2BGRA)

    alpha = img_bgra[:, :, 3]
    img_bgr = img_bgra[:, :, :3]
    subject_mask = (alpha > 12)

    result_bgr, info = recolour_subject(
        img_bgr=img_bgr,
        subject_mask=subject_mask,
        target_hex=target_hex,
        colorize_mode=colorize_mode,
        hue_tolerance=hue_tolerance,
        sat_blend=sat_blend,
        part_type=part_type,
    )

    # Attach alpha back
    result_bgra = np.dstack([result_bgr[:, :, 0], result_bgr[:, :, 1], result_bgr[:, :, 2], alpha])
    return result_bgra, info


# ── In-place recolour (keep background) ───────────────────────────────────────

def smart_recolour_inplace(
    img_bgr: np.ndarray,
    target_hex: str,
    colorize_mode: bool = False,
    part_type: str = "",
    hue_tolerance: int = 38,
    sat_blend: float = 0.85,
) -> tuple:
    """Recolour the subject on the original BGR image, leaving the background intact."""
    # Obtain subject mask locally using GrabCut segmentation
    subject_mask = get_grabcut_mask(img_bgr)

    return recolour_subject(
        img_bgr=img_bgr,
        subject_mask=subject_mask,
        target_hex=target_hex,
        colorize_mode=colorize_mode,
        hue_tolerance=hue_tolerance,
        sat_blend=sat_blend,
        part_type=part_type,
    )


# ── Helpers ────────────────────────────────────────────────────────────────────

def bytes_to_bgra(data: bytes):
    arr = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
    if img is None:
        return None
    if img.ndim == 3 and img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    return img


def bytes_to_bgr(data: bytes):
    """Decode image bytes to plain BGR (no alpha)."""
    arr = np.frombuffer(data, np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def bgra_to_bytes(img_bgra: np.ndarray) -> bytes:
    ok, buf = cv2.imencode(".png", img_bgra)
    if not ok:
        raise RuntimeError("PNG encoding failed")
    return buf.tobytes()


def to_data_uri(data: bytes, mime: str = "image/png") -> str:
    return f"data:{mime};base64," + base64.b64encode(data).decode()


def save_output(data: bytes, color: str, out_dir: Path) -> Path:
    try:
        ts    = datetime.now().strftime("%Y%m%d_%H%M%S")
        fname = f"recoloured_{color.lstrip('#')}_{ts}.jpg"
        path  = out_dir / fname
        out_dir.mkdir(exist_ok=True)
        path.write_bytes(data)
        return path
    except Exception:
        return Path("skipped_readonly")


def restore_protected_logo(original_bgr: np.ndarray, result_img: np.ndarray) -> np.ndarray:
    """Restore the original green logo region onto the recoloured result (handles BGR and BGRA)."""
    h_orig, w_orig = original_bgr.shape[:2]
    h_res, w_res = result_img.shape[:2]
    
    # Ensure they are the same size
    if h_orig != h_res or w_orig != w_res:
        result_img = cv2.resize(result_img, (w_orig, h_orig), interpolation=cv2.INTER_CUBIC)
        
    # Re-detect the green logo mask on the original image
    img_hsv = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    hue_map = img_hsv[:, :, 0]
    sat_map = img_hsv[:, :, 1]
    val_map = img_hsv[:, :, 2]
    
    raw_green_mask = (hue_map >= 30) & (hue_map <= 90) & (sat_map >= 60) & (val_map >= 60)
    kernel_open = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    logo_green_mask = cv2.morphologyEx(raw_green_mask.astype(np.uint8), cv2.MORPH_OPEN, kernel_open) > 0
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (11, 11))
    dilated_logo = cv2.dilate(logo_green_mask.astype(np.uint8), kernel) > 0
    
    if dilated_logo.any():
        if result_img.shape[2] == 4:
            # Result has alpha channel (BGRA)
            result_img[dilated_logo, :3] = original_bgr[dilated_logo]
            result_img[dilated_logo, 3] = 255 # make logo fully opaque
        else:
            # Result is BGR
            result_img[dilated_logo] = original_bgr[dilated_logo]
            
    return result_img


def photoroom_ai_recolour(
    image_bytes: bytes,
    prompt: str,
    keep_bg: bool = False,
    filename: str = "image.jpg"
) -> tuple:
    """Call Photoroom v2 API with editWithAI to change colors using prompt."""
    mime = "image/png" if filename.lower().endswith(".png") else "image/jpeg"
    bg_mode = "original" if keep_bg else "transparent"
    
    try:
        resp = requests.post(
            PR_ENDPOINT,
            headers={"x-api-key": API_KEY},
            data={
                "background.mode": bg_mode,
                "editWithAI.mode": "ai.auto",
                "editWithAI.prompt": prompt,
                "referenceBox": "originalImage",
            },
            files={"imageFile": (filename, image_bytes, mime)},
            timeout=45,
        )
    except requests.exceptions.Timeout:
        return None, "Photoroom API timeout (>45s)"
    except Exception as e:
        return None, f"Network error: {e}"

    if resp.status_code == 200:
        return resp.content, None
    return None, f"Photoroom API {resp.status_code}: {resp.text[:200]}"


if __name__ == "__main__":
    import argparse
    import sys
    
    parser = argparse.ArgumentParser(description="Recolour cars and parts locally or using Photoroom AI.")
    parser.add_argument("--image", required=True, help="Path to input image file.")
    parser.add_argument("--color", required=True, help="Target hex color code (e.g. #ff0000 or #22c55e).")
    parser.add_argument("--output", help="Path to save the output image. If not specified, saves to outputs/ directory.")
    parser.add_argument("--keep-bg", action="store_true", help="Keep the original background (uses offline GrabCut).")
    parser.add_argument("--colorize", action="store_true", help="Force colorize mode instead of hue shifting.")
    parser.add_argument("--part", default="", help="Automotive part type for tuned settings (e.g., bumper, spoiler, diffuser).")
    parser.add_argument("--engine", choices=["local", "photoroom"], default="local", help="Recolouring engine (local OpenCV or Photoroom AI).")
    parser.add_argument("--prompt", default="", help="Custom prompt for Photoroom AI engine (optional).")
    
    args = parser.parse_args()
    
    input_path = Path(args.image)
    if not input_path.exists():
        print(f"Error: Input image {args.image} does not exist.")
        sys.exit(1)
        
    image_bytes = input_path.read_bytes()
    out_dir = Path("outputs")
    out_dir.mkdir(exist_ok=True)
    
    if args.engine == "photoroom":
        prompt = args.prompt
        if not prompt:
            COLOR_NAMES = {
                "#e33d72": "hot pink",
                "#ef4444": "red",
                "#f97316": "orange",
                "#eab308": "yellow",
                "#84cc16": "lime green",
                "#22c55e": "green",
                "#06b6d4": "cyan",
                "#3b82f6": "blue",
                "#8b5cf6": "purple",
                "#ec4899": "pink",
                "#f0f0f0": "white",
                "#1a1a1a": "black",
                "#6b7280": "grey",
                "#92400e": "brown",
                "#0e7490": "teal",
                "#7c3aed": "deep purple"
            }
            color_name = COLOR_NAMES.get(args.color.lower().strip(), args.color)
            if args.part:
                prompt = f"Change the color of the {args.part} to {color_name}"
            else:
                prompt = f"Change the color of the car to {color_name}"
                
        print(f"Calling Photoroom AI with prompt: '{prompt}'...")
        
        if args.keep_bg:
            # Replicate app.py composition logic
            transparent_bytes, err = photoroom_ai_recolour(image_bytes, prompt, keep_bg=False, filename=input_path.name)
            if err:
                print(f"Error: {err}")
                sys.exit(1)
                
            original_bgr = bytes_to_bgr(image_bytes)
            result_bgra = bytes_to_bgra(transparent_bytes)
            if original_bgr is not None and result_bgra is not None:
                result_bgra = restore_protected_logo(original_bgr, result_bgra)
                h_orig, w_orig = original_bgr.shape[:2]
                h_res, w_res = result_bgra.shape[:2]
                if h_orig != h_res or w_orig != w_res:
                    result_bgra = cv2.resize(result_bgra, (w_orig, h_orig), interpolation=cv2.INTER_CUBIC)
                alpha = result_bgra[:, :, 3].astype(float) / 255.0
                composited = original_bgr.copy().astype(float)
                for c in range(3):
                    composited[:, :, c] = result_bgra[:, :, c].astype(float) * alpha + composited[:, :, c] * (1.0 - alpha)
                result_bgr = np.clip(composited, 0, 255).astype(np.uint8)
                result_bytes = cv2.imencode(".jpg", result_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])[1].tobytes()
            else:
                result_bytes = transparent_bytes
        else:
            result_bytes, err = photoroom_ai_recolour(image_bytes, prompt, keep_bg=False, filename=input_path.name)
            if err:
                print(f"Error: {err}")
                sys.exit(1)
    else:
        # Local Engine
        if args.keep_bg:
            img_bgr = bytes_to_bgr(image_bytes)
            if img_bgr is None:
                print("Error: Could not decode image.")
                sys.exit(1)
            result_bgr, info = smart_recolour_inplace(
                img_bgr, args.color, colorize_mode=args.colorize, part_type=args.part
            )
            result_bytes = cv2.imencode(".jpg", result_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])[1].tobytes()
        else:
            nobg_bytes, err = remove_background(image_bytes, input_path.name)
            if err:
                print(f"Error removing background: {err}")
                sys.exit(1)
            img_bgra = bytes_to_bgra(nobg_bytes)
            if img_bgra is None:
                print("Error decoding background-removed image.")
                sys.exit(1)
            result_bgra, info = smart_recolour(
                img_bgra, args.color, colorize_mode=args.colorize, part_type=args.part
            )
            result_bytes = bgra_to_bytes(result_bgra)
            
    # Save output
    if args.output:
        out_path = Path(args.output)
    else:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        ext = ".png" if not args.keep_bg else ".jpg"
        out_path = out_dir / f"cli_recoloured_{args.color.lstrip('#')}_{ts}{ext}"
        
    out_path.write_bytes(result_bytes)
    print(f"Success! Saved recoloured image to: {out_path}")

