const dataset = require('./data');

// Step 1: Create a map of disease -> Set(symptoms)
const diseaseSymptomMap = {};
dataset.forEach(entry => {
  const disease = entry.disease.trim();
  const symptoms = entry.symptoms.map(s => s.trim().toLowerCase());
  diseaseSymptomMap[disease] = new Set(symptoms);
});

// Function to get symptoms related to a pain
function getSymptomsForPain(painSymptom) {
  const pain = painSymptom.trim().toLowerCase();
  const relatedSymptoms = new Set();

  for (const symptoms of Object.values(diseaseSymptomMap)) {
    if (symptoms.has(pain)) {
      symptoms.forEach(symptom => {
        if (symptom !== pain) relatedSymptoms.add(symptom);
      });
    }
  }

  return Array.from(relatedSymptoms);
}

// Function to match diseases with >= 3 matching symptoms
function matchDiseases(painSymptom, userSelectedSymptoms) {
  const matches = [];
  const pain = painSymptom.trim().toLowerCase();
  const userSet = new Set(userSelectedSymptoms.map(s => s.trim().toLowerCase()));
  userSet.add(pain); // Include pain in matching

  for (const [disease, symptoms] of Object.entries(diseaseSymptomMap)) {
    const matchCount = [...symptoms].filter(sym => userSet.has(sym)).length;
    if (matchCount >= 3) {
      matches.push(disease);
    }
  }

  return matches;
}

// ✅ Export properly
module.exports = {
  getSymptomsForPain,
  matchDiseases
};
