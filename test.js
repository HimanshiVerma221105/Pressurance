// test.js
const { getSymptomsForPain, matchDiseases } = require('./painMatcher.js');

// Test pain symptom
const pain = 'chest_pain';

// STEP 1: Get related symptoms
const relatedSymptoms = getSymptomsForPain(pain);
console.log(`🧠 Related symptoms for "${pain}":`);
console.log(relatedSymptoms);

// Simulate user selecting symptoms
const userCheckedSymptoms = ['headache', 'dizziness']; // simulate selection

// STEP 2: Match diseases
const matched = matchDiseases(pain, userCheckedSymptoms);
console.log(`\n✅ Diseases with 3+ matching symptoms:`);
console.log(matched.slice(0, 2)); // top 1-2 results
