// Simple icon generation script for PWA
// This creates basic colored square icons as placeholders

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create simple SVG icon template
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <rect x="${size/8}" y="${size/8}" width="${size*3/4}" height="${size*3/4}" fill="#ffffff" rx="${size/16}"/>
  <path d="M${size/3} ${size/2.5} L${size/2} ${size/1.8} L${size*2/3} ${size/2.5}" stroke="#2563eb" stroke-width="${size/32}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${size/2}" cy="${size/1.4}" r="${size/16}" fill="#2563eb"/>
  <text x="${size/2}" y="${size*0.85}" text-anchor="middle" fill="#2563eb" font-family="Arial, sans-serif" font-size="${size/16}" font-weight="bold">DS</text>
</svg>`;

// Generate icon files
sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const svgPath = path.join(iconDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('All PWA icons generated successfully!');