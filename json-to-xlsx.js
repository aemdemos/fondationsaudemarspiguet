const fs = require('fs');
const XLSX = require('xlsx');

// Function to convert JSON to Excel worksheet
function jsonToWorksheet(jsonData, sheetName) {
  const markers = jsonData.markers;
  
  if (!markers || markers.length === 0) {
    console.log(`No markers found in ${sheetName} data`);
    return null;
  }
  
  // Create worksheet from JSON data
  const worksheet = XLSX.utils.json_to_sheet(markers);
  
  // Auto-size columns
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const colWidths = [];
  
  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxWidth = 10; // minimum width
    
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      
      if (cell && cell.v) {
        const cellValue = String(cell.v);
        maxWidth = Math.max(maxWidth, Math.min(cellValue.length, 50)); // max width of 50
      }
    }
    
    colWidths.push({ wch: maxWidth });
  }
  
  worksheet['!cols'] = colWidths;
  
  return worksheet;
}

// Function to create Excel file from JSON data
function createExcelFile(jsonFilePath, outputFileName, sheetName) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    const worksheet = jsonToWorksheet(jsonData, sheetName);
    
    if (!worksheet) {
      console.log(`❌ Failed to create worksheet for ${sheetName}`);
      return false;
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Write the Excel file
    XLSX.writeFile(workbook, outputFileName);
    
    console.log(`✅ Created ${outputFileName} with ${jsonData.markers.length} markers`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${outputFileName}:`, error.message);
    return false;
  }
}

console.log('🔄 Creating Excel files from JSON data...');
console.log('');

// Create Excel files for all JSON datasets
const files = [
  {
    json: 'blocks/map/markers-data.json',
    excel: 'markers-data-map-english.xlsx',
    sheet: 'Map-English'
  },
  {
    json: 'blocks/map/markers-data-fr.json',
    excel: 'markers-data-map-french.xlsx',
    sheet: 'Map-French'
  },
  {
    json: 'blocks/map-bien/markers-data.json',
    excel: 'markers-data-map-bien-english.xlsx',
    sheet: 'Map-Bien-English'
  },
  {
    json: 'blocks/map-bien/markers-data-fr.json',
    excel: 'markers-data-map-bien-french.xlsx',
    sheet: 'Map-Bien-French'
  }
];

let successCount = 0;

files.forEach(file => {
  if (createExcelFile(file.json, file.excel, file.sheet)) {
    successCount++;
  }
});

console.log('');
console.log(`📊 Summary: ${successCount}/${files.length} Excel files created successfully`);
console.log('');
console.log('📁 Generated files:');
console.log('   • markers-data-map-english.xlsx (Map project markers - English)');
console.log('   • markers-data-map-french.xlsx (Map project markers - French)');
console.log('   • markers-data-map-bien-english.xlsx (Map-Bien project markers - English)');
console.log('   • markers-data-map-bien-french.xlsx (Map-Bien project markers - French)');
