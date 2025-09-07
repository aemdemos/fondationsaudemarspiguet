const fs = require('fs');

// Read the map-bien script file
const scriptContent = fs.readFileSync('blocks/map-bien/initmapscript.js', 'utf8');

// Extract all markers data
const markers = [];

// Split into lines for processing
const lines = scriptContent.split('\n');

// Process each line to extract marker data
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Look for createInfoBoxContent calls
  if (line.includes('myOptions.content=createInfoBoxContent(')) {
    try {
      // Extract the function call parameters
      const match = line.match(/createInfoBoxContent\(([^)]+)\)/);
      if (match) {
        // Parse the parameters
        const paramsStr = match[1];
        // Split by comma but handle quoted strings properly
        const params = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';
        let parenDepth = 0;
        
        for (let j = 0; j < paramsStr.length; j++) {
          const char = paramsStr[j];
          
          if ((char === '"' || char === "'") && !inQuotes) {
            inQuotes = true;
            quoteChar = char;
            current += char;
          } else if (char === quoteChar && inQuotes) {
            inQuotes = false;
            quoteChar = '';
            current += char;
          } else if (char === '(' && !inQuotes) {
            parenDepth++;
            current += char;
          } else if (char === ')' && !inQuotes) {
            parenDepth--;
            current += char;
          } else if (char === ',' && !inQuotes && parenDepth === 0) {
            params.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        if (current.trim()) {
          params.push(current.trim());
        }
        
        if (params.length >= 8) {
          // Clean up parameters by removing quotes
          const cleanParams = params.map(p => {
            let clean = p.trim();
            if ((clean.startsWith('"') && clean.endsWith('"')) || 
                (clean.startsWith("'") && clean.endsWith("'"))) {
              clean = clean.slice(1, -1);
            }
            return clean;
          });
          
          const [imageId, imageName, partner, country, dateRange, title, category, projectSlug] = cleanParams;
          
          // Look ahead for infoWindows, coordinates, and category
          let itemId = null;
          let latitude = null;
          let longitude = null;
          let categoryClasses = '';
          
          // Search next 20 lines for the related data
          for (let k = i + 1; k < Math.min(i + 20, lines.length); k++) {
            const nextLine = lines[k];
            
            // Extract infoWindows item ID
            if (nextLine.includes('infoWindows[')) {
              const itemMatch = nextLine.match(/infoWindows\[(\d+)\]/);
              if (itemMatch) {
                itemId = parseInt(itemMatch[1]);
              }
            }
            
            // Extract coordinates
            if (nextLine.includes('markerLatLng= new google.maps.LatLng')) {
              const coordMatch = nextLine.match(/LatLng\s*\(([^,]+),([^)]+)\)/);
              if (coordMatch) {
                latitude = parseFloat(coordMatch[1].trim());
                longitude = parseFloat(coordMatch[2].trim());
              }
            }
            
            // Extract category classes
            if (nextLine.includes('category:')) {
              const catMatch = nextLine.match(/category:\s*"([^"]+)"/);
              if (catMatch) {
                categoryClasses = catMatch[1].trim();
              }
            }
          }
          
          // Create marker object
          const marker = {
            imageId: parseInt(imageId) || imageId,
            imageName,
            partner,
            country,
            dateRange,
            title,
            category,
            projectSlug,
            itemId,
            latitude,
            longitude,
            categoryClasses
          };
          
          markers.push(marker);
          console.log(`✅ Extracted marker ${markers.length}: ${title.substring(0, 50)}...`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Error processing line ${i + 1}: ${error.message}`);
    }
  }
}

// Create JSON structure
const jsonData = {
  markers: markers
};

// Write to file
fs.writeFileSync('blocks/map-bien/markers-data.json', JSON.stringify(jsonData, null, 2));

console.log(`\n🎯 Extraction complete!`);
console.log(`📊 Total markers extracted: ${markers.length}`);
console.log(`📁 File created: blocks/map-bien/markers-data.json`);

// Show sample data
if (markers.length > 0) {
  console.log('\n📋 Sample marker structure:');
  console.log(JSON.stringify(markers[0], null, 2));
}
