const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      return JSON.parse(
        Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
          'base64'
        ).toString('utf8')
      );
    } catch (error) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_BASE64 is invalid. Copy the complete base64 value.'
      );
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT is invalid JSON. Use the base64 variable instead.'
      );
    }
  }

  const localKeyPath = path.join(__dirname, 'serviceAccountKey.json');

  if (!fs.existsSync(localKeyPath)) {
    throw new Error(
      'Firebase credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_BASE64 on Render or add serviceAccountKey.json locally.'
    );
  }

  return require(localKeyPath);
}

initializeApp({
  credential: cert(loadServiceAccount())
});

module.exports = getFirestore();
