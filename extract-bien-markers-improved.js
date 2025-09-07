const fs = require('fs');

// Read the map-bien script file
const scriptContent = fs.readFileSync('blocks/map-bien/initmapscript.js', 'utf8');

// Extract all markers data using regex
const markers = [];

// Find all createInfoBoxContent calls with regex
const createInfoPattern = /myOptions\.content=createInfoBoxContent\(([^;]+)\);/g;
let match;

while ((match = createInfoPattern.exec(scriptContent)) !== null) {
  try {
    const fullCall = match[0];
    const paramsStr = match[1];
    
    console.log(`Processing: ${fullCall.substring(0, 100)}...`);
    
    // Use a more robust approach to extract parameters
    // Split the script into sections and find the related infoWindows, coordinates, etc.
    const callPosition = match.index;
    
    // Get the section around this call (next 500 characters should contain infoWindows, coordinates, category)
    const sectionStart = callPosition;
    const sectionEnd = Math.min(callPosition + 800, scriptContent.length);
    const section = scriptContent.substring(sectionStart, sectionEnd);
    
    // Extract individual parameters manually for more reliability
    // Pattern: createInfoBoxContent(imageId, "imageName", "partner", "country", "dateRange", "title", "category", "projectSlug")
    
    // Find the opening parenthesis
    const openParen = section.indexOf('(');
    const closeParen = section.indexOf(');');
    
    if (openParen === -1 || closeParen === -1) {
      console.log('❌ Could not find parentheses');
      continue;
    }
    
    const params = section.substring(openParen + 1, closeParen);
    
    // Use a simple approach: split by comma and then clean up
    const rawParams = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < params.length; i++) {
      const char = params[i];
      
      if ((char === '"' || char === "'") && (i === 0 || params[i-1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = '';
        }
        current += char;
      } else if (char === ',' && !inQuotes) {
        rawParams.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      rawParams.push(current.trim());
    }
    
    if (rawParams.length < 8) {
      console.log(`❌ Not enough parameters (${rawParams.length}), skipping`);
      continue;
    }
    
    // Clean up parameters
    const cleanParams = rawParams.map(p => {
      let clean = p.trim();
      // Remove outer quotes
      if ((clean.startsWith('"') && clean.endsWith('"')) || 
          (clean.startsWith("'") && clean.endsWith("'"))) {
        clean = clean.slice(1, -1);
      }
      // Unescape inner quotes
      clean = clean.replace(/\\"/g, '"').replace(/\\'/g, "'");
      return clean;
    });
    
    const [imageId, imageName, partner, country, dateRange, title, category, projectSlug] = cleanParams;
    
    // Extract infoWindows item ID
    const infoWindowsMatch = section.match(/infoWindows\[(\d+)\]/);
    const itemId = infoWindowsMatch ? parseInt(infoWindowsMatch[1]) : null;
    
    // Extract coordinates
    const coordMatch = section.match(/markerLatLng=\s*new\s+google\.maps\.LatLng\s*\(([^,]+),([^)]+)\)/);
    const latitude = coordMatch ? parseFloat(coordMatch[1].trim()) : null;
    const longitude = coordMatch ? parseFloat(coordMatch[2].trim()) : null;
    
    // Extract category classes
    const categoryMatch = section.match(/category:\s*"([^"]+)"/);
    const categoryClasses = categoryMatch ? categoryMatch[1].trim() : '';
    
    // Create marker object
    const marker = {
      imageId: isNaN(parseInt(imageId)) ? imageId : parseInt(imageId),
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
    
  } catch (error) {
    console.log(`⚠️ Error processing marker: ${error.message}`);
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
  console.log('\n📋 First marker structure:');
  console.log(JSON.stringify(markers[0], null, 2));
  
  console.log('\n📋 Last marker structure:');
  console.log(JSON.stringify(markers[markers.length - 1], null, 2));
}
