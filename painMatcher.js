const fs = require('fs');
const { getSymptomsForPain, matchDiseases } = require('./matcher');

// Step 1: Read pain symptom from symptom.txt
const painSymptom = fs.readFileSync('symptom.txt', 'utf8').trim().toLowerCase();
console.log(`\n🔎 Pain Symptom Entered: ${painSymptom}`);

// Step 2: Get related symptoms
const relatedSymptoms = getSymptomsForPain(painSymptom);
if (relatedSymptoms.length === 0) {
  console.log("⚠️  No related symptoms found for this pain.");
  process.exit(0);
}

console.log(`\n📝 Related Symptoms to Choose From:\n - ${relatedSymptoms.join('\n - ')}`);

// Step 3: Simulate user selecting symptoms (manually selected or via frontend later)
const userSelectedSymptoms = [
  // 🛠️ Simulate selection – change these as needed for testing
  "headache",
  "chest_pain",
  "dizziness"
];

console.log(`\n✅ User Selected Symptoms: ${userSelectedSymptoms.join(', ')}`);

// Step 4: Find matching diseases (>= 3 matching symptoms)
const matchedDiseases = matchDiseases(painSymptom, userSelectedSymptoms);

if (matchedDiseases.length > 0) {
  console.log(`\n🦠 Possible Disease(s) Matching 3+ Symptoms:`);
  matchedDiseases.forEach(disease => console.log(` - ${disease}`));
} else {
  console.log("\n❌ No disease found with 3 or more matching symptoms.");
}
