// This script creates simple SVG icons for the extension
const fs = require('fs');

// Create a simple SVG icon with a "T" (for Twitter) and a mute symbol
function createSVGIcon(size) {
  const radius = size / 2;
  const strokeWidth = size / 16;
  const fontSize = size / 2;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${radius}" cy="${radius}" r="${radius - strokeWidth/2}" fill="#1DA1F2" stroke="white" stroke-width="${strokeWidth}"/>
  <text x="${radius}" y="${radius + fontSize/3}" font-family="Arial" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle">T</text>
  <line x1="${size/4}" y1="${size*3/4}" x2="${size*3/4}" y2="${size/4}" stroke="red" stroke-width="${strokeWidth}" stroke-linecap="round" />
  <circle cx="${radius}" cy="${radius}" r="${radius - strokeWidth*2}" fill="none" stroke="white" stroke-width="${strokeWidth/2}" stroke-opacity="0.5"/>
</svg>`;
}

// Create icons in different sizes
const sizes = [16, 48, 128];

// Create the images directory if it doesn't exist
if (!fs.existsSync('./images')) {
  fs.mkdirSync('./images');
}

// Generate the icons
sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  fs.writeFileSync(`./images/icon${size}.svg`, svgContent);
  console.log(`Created icon${size}.svg`);
});

console.log('Icons created! You may need to convert these SVG files to PNG for Chrome extensions.'); 