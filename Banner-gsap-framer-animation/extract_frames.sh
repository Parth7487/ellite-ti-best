#!/bin/bash
set -e

# Configuration
VIDEO_FILE="/home/parth/Documents/Car_Designs/ellite-ti-best/Banner-gsap-framer-animation/Car_transforming_through_colors_1080p_202606240327.mp4"
FRAMES_DIR="/home/parth/Documents/Car_Designs/ellite-ti-best/Banner-gsap-framer-animation/frames"
PUBLIC_LINK_DIR="/home/parth/Documents/Car_Designs/ellite-ti-best/public/Banner-gsap-framer-animation"

echo "Creating frames directory at $FRAMES_DIR..."
mkdir -p "$FRAMES_DIR"

echo "Extracting video frames to WebP with optimized compression speed..."
# Removing -compression_level 6 for standard speed
# Using -preset picture for optimized color preservation
ffmpeg -y -i "$VIDEO_FILE" \
       -vf "scale=1920:-1" \
       -codec:v libwebp \
       -lossless 0 \
       -preset picture \
       -q:v 75 \
       -f image2 \
       "$FRAMES_DIR/frame_%03d.webp"

echo "Creating public directory symlinks..."
mkdir -p "$PUBLIC_LINK_DIR"
# Link the frames folder directly into the public directory
ln -sfn "$FRAMES_DIR" "$PUBLIC_LINK_DIR/frames"

echo "Frames extraction complete!"
