# PWA Icons - TODO

## Missing Icons

The following icon files are referenced but not yet created:

1. **favicon.ico** - 32x32px icon for browser tab
2. **icon-192x192.png** - 192x192px PWA icon
3. **icon-512x512.png** - 512x512px PWA icon

## How to Create Icons

### Option 1: Use Figma/Design Tool
1. Create a square logo (512x512px)
2. Export as PNG at different sizes:
   - 512x512px → `icon-512x512.png`
   - 192x192px → `icon-192x192.png`
   - 32x32px → `favicon.ico` (convert PNG to ICO)

### Option 2: Use Online Tools
- **Favicon Generator**: https://realfavicongenerator.net/
- **PWA Icon Generator**: https://www.pwabuilder.com/imageGenerator

### Option 3: Quick Placeholder
Use a simple tool to create solid color icons:

```bash
# Install ImageMagick (if not installed)
brew install imagemagick  # macOS
apt-get install imagemagick  # Ubuntu

# Create placeholder icons
convert -size 512x512 xc:#0ea5e9 -font Arial -pointsize 200 -fill white -gravity center -annotate +0+0 "UAE" public/icon-512x512.png
convert public/icon-512x512.png -resize 192x192 public/icon-192x192.png
convert public/icon-512x512.png -resize 32x32 public/favicon.ico
```

## Recommended Design

**Brand Colors:**
- Primary: #0ea5e9 (Sky blue)
- Background: White or transparent

**Icon Elements:**
- UAE flag colors (optional)
- Chart/graph symbol
- Money/currency symbol
- Simple, recognizable at small sizes

## For Production

Before production deployment, replace placeholders with professionally designed icons that match your brand identity.

**Design Checklist:**
- [ ] Logo looks good at all sizes (16px to 512px)
- [ ] High contrast for visibility
- [ ] Transparent or white background
- [ ] Consistent with brand colors
- [ ] Tested on iOS and Android
- [ ] Tested in light/dark modes
