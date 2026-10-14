const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON.');
  }
} else {
  const localKeyPath = path.join(__dirname, 'serviceAccountKey.json');

  if (!fs.existsSync(localKeyPath)) {
    throw new Error(
      'Firebase credentials are missing. Set FIREBASE_SERVICE_ACCOUNT on Render or add serviceAccountKey.json locally.'
    );
  }

  serviceAccount = require(localKeyPath);
}

initializeApp({
  credential: cert(serviceAccount)
});

module.exports = getFirestore();
