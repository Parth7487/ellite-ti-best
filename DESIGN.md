---
name: Elite Ti JDM Cockpit Customizer
version: "1.0"
colors:
  primary: "#ffffff"       # High-contrast white headers
  secondary: "#8e9192"     # Technical muted labels
  accent: "#bdf522"        # Elite Ti signature acid lime glow
  background: "#030409"    # Deep space black
  surface: "rgba(255, 255, 255, 0.02)" # Glassmorphism base
  border: "rgba(255, 255, 255, 0.08)"  # Glassmorphism edge glow
fonts:
  headers: "Teko, Syncopate"
  body: "Plus Jakarta Sans"
  mono: "JetBrains Mono"
rounded:
  sm: "4px"
  md: "8px"
  lg: "20px"
---

# JDM COCKPIT CUSTOMIZER DESIGN SPECIFICATION

This document outlines the visual guidelines, design tokens, asset lists, hotspots, and product specifications for the JDM Cockpit Customizer. It serves as a unified reference system for AI coding models.

---

## 1. BRAND IDENTITY & VISUAL LANGUAGE
The visual design system of Elite Ti is high-performance, engineering-oriented, and cinematic.

*   **Atmosphere**: Glassmorphic dark mode, combining semi-translucent cards with vivid neon indicator lights.
*   **Typography**:
    *   *Primary Displays*: Ultra-wide uppercase headers (using `Syncopate` and `Teko`) to represent precision engineering.
    *   *Sub-Labels*: Monospaced typography (`JetBrains Mono`) for technical parameters, prices, and coordinates.
    *   *Body Copy*: Highly readable sans-serif (`Plus Jakarta Sans`).
*   **Micro-interactions**: Understated 3D camera pan/tilts, neon laser scanning lines during asset loading, and synthesized sound effects on interface actions.

---

## 2. UPGRADE ZONES & SPECIFICATION SCHEMAS
The customizer allows modular upgrades to specific zones of JDM dashboards (supported platforms: Toyota Supra JZA80 and Mazda RX-7 FD3S).

The active upgrade zones are:
1.  **Steering Wheel**: Premium grip and center bezel carbon finishes.
2.  **Dashboard**: The primary front console faceplate.
3.  **Upper Glove Box**: The top storage door element.
4.  **Lower Glove Box**: The bottom console footwell shroud.

---

## 3. IMAGE ASSETS DATABASE (LOCAL DIRECTORY)
The following local files are used as texture maps and viewport layers for the configurator:

### Toyota Supra JZA80 Assets
*   **Base OEM Cockpit (Standard)**:
    [WhatsApp Image 2026-06-26 at 13.32.42.jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42.jpeg)
*   **Base Carbon Cockpit (Upgraded)**:
    [WhatsApp Image 2026-06-26 at 13.32.42 (3).jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42%20%283%29.jpeg)
*   **Steering Wheel Texture (Style 1)**:
    [WhatsApp Image 2026-06-26 at 13.33.07 (1).jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.07%20%281%29.jpeg)
*   **Steering Wheel Texture (Style 2)**:
    [WhatsApp Image 2026-06-26 at 13.33.08.jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.08.jpeg)
*   **Upper Glove Box Highlight**:
    [WhatsApp Image 2026-06-26 at 13.33.05 (1).jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.05%20%281%29.jpeg)
*   **Lower Glove Box Highlight**:
    [WhatsApp Image 2026-06-26 at 13.33.05.jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/Supra/WhatsApp Image 2026-06-26 at 13.33.05.jpeg)

### Mazda RX-7 FD3S Assets
*   **Steering Wheel Texture (Style 1)**:
    [WhatsApp Image 2026-06-26 at 13.32.42 (1).jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42%20%281%29.jpeg)
*   **Steering Wheel Texture (Style 2)**:
    [WhatsApp Image 2026-06-26 at 13.32.42 (2).jpeg](file:///home/parth/Documents/Car_Designs/ellite-ti-best/content/blogs/Interrior/New Folder With Items/WhatsApp Image 2026-06-26 at 13.32.42%20%282%29.jpeg)

---

## 4. COORDINATE SCHEMA FOR HOTSPOTS
When mapping 2D customizer canvas layouts on a widescreen viewport (16:9 ratio), the target hotspot points are anchored at:

```json
{
  "chassis": "supra",
  "hotspots": {
    "steering": {
      "left": "60.6%",
      "top": "31.1%"
    },
    "dashboard": {
      "left": "36.4%",
      "top": "17.7%"
    },
    "upperGloveBox": {
      "left": "22.1%",
      "top": "28.0%"
    },
    "lowerGloveBox": {
      "left": "18.0%",
      "top": "39.5%"
    }
  }
}
```

---

## 5. THE 10-MATERIAL OPTIONS MATRIX
To achieve high customization depth, the customizer contains 10 distinct high-end finishes for each upgrade zone:

| Material ID | Display Name | Weave / Material Type | Price (USD) | Weight Delta | Rendering CSS / HSL Filter Profile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `dry-carbon` | Autoclave Dry Carbon (Matte) | 2x2 Twill Matte Pre-preg | $1,250 | -2.4 KG | `grayscale(1) brightness(0.6) contrast(1.4)` |
| `gloss-carbon` | Autoclave Gloss Carbon (Shine) | 3K Mirror-Gloss Twill | $1,450 | -2.2 KG | `grayscale(1) brightness(0.85) contrast(1.7)` |
| `forged-carbon` | Forged Composite Carbon | Random Chopped Carbon | $1,850 | -2.8 KG | `contrast(1.3) saturate(0.2) sepia(0.1)` |
| `yellow-kevlar` | Gold Aramid-Kevlar Hybrid | Gold/Black Hybrid Weave | $1,650 | -2.1 KG | `sepia(0.6) saturate(3) hue-rotate(15deg) brightness(0.7)` |
| `red-kevlar` | Ruby Aramid-Kevlar Hybrid | Ruby/Black Hybrid Weave | $1,650 | -2.1 KG | `sepia(0.4) saturate(5) hue-rotate(-45deg) brightness(0.7)` |
| `blue-kevlar` | Sapphire Aramid-Kevlar Hybrid | Sapphire/Black Hybrid Weave | $1,650 | -2.1 KG | `sepia(0.2) saturate(5) hue-rotate(170deg) brightness(0.7)` |
| `titanium-mesh` | Grade 5 Titanium Honeycomb | Hexagonal Metal Mesh | $2,250 | -1.8 KG | `contrast(1.6) brightness(1.2) hue-rotate(240deg)` |
| `alcantara` | Spirit Alcantara Suede (Slate) | Slate Grey Suede Grip Wrap | $950 | -1.5 KG | `blur(0.4px) grayscale(1) brightness(0.7) contrast(1.1)` |
| `nappa-leather` | Bespoke Nappa Leather | Hand-stitched full hide | $1,150 | -1.2 KG | `brightness(0.55) contrast(1.3) saturate(0.5)` |
| `acid-accent` | Custom Acid Green Accent | Acid Twill Weave | $1,750 | -2.0 KG | `sepia(0.5) saturate(4) hue-rotate(45deg) brightness(0.7)` |

---

## 6. SYSTEM STACK RECOMMENDATION FOR IMPLEMENTATION
To implement the configurator natively on the live homepage:
1.  **Framework**: React (Vite-based dev environment).
2.  **3D Rendering**: `three.js` + `@react-three/fiber` (React-native canvas wrapper).
3.  **Helpers**: `@react-three/drei` (specifically using `<OrbitControls>` and `<Html>` for interactive nodes).
4.  **Animations & Camera Interpolation**: `gsap` for smooth viewport transitions.
5.  **State Management**: `zustand` to bridge configurator selects to the checkout component.
