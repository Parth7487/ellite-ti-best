"""
api/index.py — Flask server for the ETi Colour Changer (Vercel Serverless Function compatible)
"""

from dotenv import load_dotenv
load_dotenv(override=True)

from flask import Flask, request, jsonify, send_file
from pathlib import Path
import json
import os
import io
import cv2
import numpy as np

try:
    from api.recolour import (
        remove_background,
        smart_recolour,
        smart_recolour_inplace,
        bytes_to_bgra,
        bytes_to_bgr,
        bgra_to_bytes,
        to_data_uri,
        save_output,
        photoroom_ai_recolour,
        restore_protected_logo,
    )
except ImportError:
    from recolour import (
        remove_background,
        smart_recolour,
        smart_recolour_inplace,
        bytes_to_bgra,
        bytes_to_bgr,
        bgra_to_bytes,
        to_data_uri,
        save_output,
        photoroom_ai_recolour,
        restore_protected_logo,
    )

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024   # 25 MB upload limit


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Vercel handles the output path internally. We configure outputs inside /tmp if writable,
# or default to Path("outputs") as a fallback.
OUTPUT_DIR = Path("/tmp/outputs") if os.path.exists("/tmp") else Path("outputs")
try:
    OUTPUT_DIR.mkdir(exist_ok=True)
except Exception:
    pass


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/")
@app.route("/api")
@app.route("/api/")
def index():
    return jsonify({
        "status": "active",
        "service": "ETi Active Recolour API Backend",
        "engine": "photoroom",
        "photoroom_api_key_configured": bool(os.getenv("PHOTOROOM_API_KEY"))
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "server": "vercel-serverless" if os.getenv("VERCEL") else "local"
    })


# COLOR NAMES lookup for Photoroom AI prompt mapping
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

def get_color_name_from_hex(hex_color: str) -> str:
    hex_color = hex_color.lower().strip()
    if hex_color in COLOR_NAMES:
        return COLOR_NAMES[hex_color]
    return hex_color


@app.route("/api/recolour", methods=["POST"])
def api_recolour():
    """
    Accepts multipart/form-data:
      - image    : the car/product photo
      - color    : hex colour string  e.g. "#3a86ff"
      - keep_bg  : "true" to skip background removal (default: "false")
      - engine   : "local" or "photoroom" (default: "local")
      - prompt   : custom Photoroom AI prompt string (optional)
    """
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    f            = request.files["image"]
    target_color = request.form.get("color", "#ff0000")
    keep_bg      = request.form.get("keep_bg", "false").lower() == "true"
    colorize     = request.form.get("colorize", "false").lower() == "true"
    part         = request.form.get("part", "")
    engine       = request.form.get("engine", "photoroom").lower()
    prompt       = request.form.get("prompt", "").strip()
    filename     = f.filename or "image.jpg"
    image_bytes  = f.read()

    orig_mime    = "image/png" if filename.lower().endswith(".png") else "image/jpeg"
    original_uri = to_data_uri(image_bytes, orig_mime)

    # ── Option B: Photoroom AI Engine ──
    if engine == "photoroom":
        if not prompt:
            color_name = get_color_name_from_hex(target_color)
            if part:
                prompt = f"Change the color of the {part} to {color_name}"
            else:
                prompt = f"Change the color of the car to {color_name}"

        # We ALWAYS call Photoroom to remove background (keep_bg=False) so we get a clean transparent PNG
        # that we can composite locally. This prevents Photoroom from turning the background black.
        result_bytes, err = photoroom_ai_recolour(image_bytes, prompt, keep_bg=False, filename=filename)
        if err:
            return jsonify({"error": f"Photoroom AI Edit failed: {err}"}), 502

        original_bgr = bytes_to_bgr(image_bytes)
        result_bgra = bytes_to_bgra(result_bytes)

        if original_bgr is not None and result_bgra is not None:
            # Restore brand logo onto the transparent car first
            result_bgra = restore_protected_logo(original_bgr, result_bgra)

            if keep_bg:
                # Composite transparent car back onto original background
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
                # Keep transparent PNG
                result_bytes = bgra_to_bytes(result_bgra)

        result_uri = to_data_uri(result_bytes, "image/jpeg" if keep_bg else "image/png")
        saved_path = save_output(result_bytes, target_color, OUTPUT_DIR)

        return jsonify({
            "original":   original_uri,
            "nobg":       None if keep_bg else result_uri,
            "result":     result_uri,
            "saved_as":   str(saved_path),
            "info": {
                "engine": "photoroom",
                "mode": "photoroom_ai",
                "prompt": prompt
            }
        })

    # ── Option A: Local OpenCV Engine ──
    if keep_bg:
        img_bgr = bytes_to_bgr(image_bytes)
        if img_bgr is None:
            return jsonify({"error": "Could not decode image"}), 500

        result_bgr, info = smart_recolour_inplace(
            img_bgr, target_color, colorize_mode=colorize, part_type=part
        )
        result_bytes     = cv2.imencode(".jpg", result_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])[1].tobytes()
        result_uri       = to_data_uri(result_bytes, "image/jpeg")
        saved_path       = save_output(result_bytes, target_color, OUTPUT_DIR)
        
        return jsonify({
            "original":   original_uri,
            "nobg":       None,
            "result":     result_uri,
            "saved_as":   str(saved_path),
            "info":       info,
        })

    nobg_bytes, err = remove_background(image_bytes, filename)
    if err:
        return jsonify({"error": f"Background removal failed: {err}"}), 502

    nobg_uri = to_data_uri(nobg_bytes)

    img_bgra = bytes_to_bgra(nobg_bytes)
    if img_bgra is None:
        return jsonify({"error": "Could not decode the background-removed image"}), 500

    result_bgra, info = smart_recolour(
        img_bgra, target_color, colorize_mode=colorize, part_type=part
    )
    result_bytes      = bgra_to_bytes(result_bgra)
    result_uri        = to_data_uri(result_bytes)
    saved_path        = save_output(result_bytes, target_color, OUTPUT_DIR)

    return jsonify({
        "original":   original_uri,
        "nobg":       nobg_uri,
        "result":     result_uri,
        "saved_as":   str(saved_path),
        "info":       info,
    })


@app.route("/api/batch", methods=["POST"])
def api_batch():
    """
    Generate multiple colour variants in one request.
    Accepts multipart/form-data:
      - image    : product photo
      - colors   : JSON array of hex strings
      - keep_bg  : "true" to skip background removal (default: "false")
      - engine   : "local" or "photoroom" (default: "local")
      - prompt   : custom Photoroom AI prompt string (optional)
    """
    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400

    f           = request.files["image"]
    colors_raw  = request.form.get("colors", "[]")
    keep_bg     = request.form.get("keep_bg", "false").lower() == "true"
    colorize    = request.form.get("colorize", "false").lower() == "true"
    part        = request.form.get("part", "")
    engine      = request.form.get("engine", "photoroom").lower()
    prompt      = request.form.get("prompt", "").strip()
    filename    = f.filename or "image.jpg"
    image_bytes = f.read()

    try:
        colors = json.loads(colors_raw)
    except Exception:
        return jsonify({"error": "Invalid colors JSON"}), 400

    if not colors:
        return jsonify({"error": "No colours specified"}), 400

    results = []

    # ── Option B: Photoroom AI Engine ──
    if engine == "photoroom":
        for color in colors:
            color_name = get_color_name_from_hex(color)
            color_prompt = prompt if prompt else (f"Change the color of the {part} to {color_name}" if part else f"Change the color of the car to {color_name}")
            
            # We ALWAYS call Photoroom to remove background (keep_bg=False) to get a clean transparent PNG
            res_bytes, err = photoroom_ai_recolour(image_bytes, color_prompt, keep_bg=False, filename=filename)
            if err:
                continue
                
            original_bgr = bytes_to_bgr(image_bytes)
            res_bgra = bytes_to_bgra(res_bytes)

            if original_bgr is not None and res_bgra is not None:
                # Restore brand logo onto the transparent car first
                res_bgra = restore_protected_logo(original_bgr, res_bgra)

                if keep_bg:
                    # Composite transparent car back onto original background
                    h_orig, w_orig = original_bgr.shape[:2]
                    h_res, w_res = res_bgra.shape[:2]
                    if h_orig != h_res or w_orig != w_res:
                        res_bgra = cv2.resize(res_bgra, (w_orig, h_orig), interpolation=cv2.INTER_CUBIC)

                    alpha = res_bgra[:, :, 3].astype(float) / 255.0
                    composited = original_bgr.copy().astype(float)
                    for c in range(3):
                        composited[:, :, c] = res_bgra[:, :, c].astype(float) * alpha + composited[:, :, c] * (1.0 - alpha)

                    res_bgr = np.clip(composited, 0, 255).astype(np.uint8)
                    res_bytes = cv2.imencode(".jpg", res_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])[1].tobytes()
                else:
                    # Keep transparent PNG
                    res_bytes = bgra_to_bytes(res_bgra)

            saved_path = save_output(res_bytes, color, OUTPUT_DIR)
            results.append({
                "color":    color,
                "image":    to_data_uri(res_bytes, "image/jpeg" if keep_bg else "image/png"),
                "info": {
                    "engine": "photoroom",
                    "mode": "photoroom_ai",
                    "prompt": color_prompt
                },
                "saved_as": str(saved_path),
            })

        return jsonify({"nobg": None, "results": results})

    # ── Option A: Local OpenCV Engine ──
    if keep_bg:
        img_bgr = bytes_to_bgr(image_bytes)
        if img_bgr is None:
            return jsonify({"error": "Could not decode image"}), 500

        for color in colors:
            result_bgr, info = smart_recolour_inplace(
                img_bgr, color, colorize_mode=colorize, part_type=part
            )
            result_bytes     = cv2.imencode(".jpg", result_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])[1].tobytes()
            saved_path       = save_output(result_bytes, color, OUTPUT_DIR)
            results.append({
                "color":    color,
                "image":    to_data_uri(result_bytes, "image/jpeg"),
                "info":     info,
                "saved_as": str(saved_path),
            })

        return jsonify({"nobg": None, "results": results})

    nobg_bytes, err = remove_background(image_bytes, filename)
    if err:
        return jsonify({"error": f"Background removal failed: {err}"}), 502

    nobg_uri = to_data_uri(nobg_bytes)
    img_bgra = bytes_to_bgra(nobg_bytes)
    if img_bgra is None:
        return jsonify({"error": "Could not decode image"}), 500

    for color in colors:
        result_bgra, info = smart_recolour(
            img_bgra, color, colorize_mode=colorize, part_type=part
        )
        result_bytes      = bgra_to_bytes(result_bgra)
        saved_path        = save_output(result_bytes, color, OUTPUT_DIR)
        results.append({
            "color":    color,
            "image":    to_data_uri(result_bytes),
            "info":     info,
            "saved_as": str(saved_path),
        })

    return jsonify({
        "nobg":    nobg_uri,
        "results": results,
    })


@app.route("/api/download", methods=["POST"])
def api_download():
    """Return the latest recoloured image as a downloadable file."""
    data_uri  = request.json.get("dataUri", "")
    filename  = request.json.get("filename", "recoloured.png")

    if not data_uri.startswith("data:"):
        return jsonify({"error": "Invalid data URI"}), 400

    import base64
    header, b64 = data_uri.split(",", 1)
    raw = base64.b64decode(b64)
    return send_file(
        io.BytesIO(raw),
        mimetype="image/png",
        as_attachment=True,
        download_name=filename,
    )


# ── Entry ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5050))
    print(f"\n🎨  ETi Colour Changer  →  http://localhost:{port}\n")
    app.run(debug=True, port=port, host="0.0.0.0")
