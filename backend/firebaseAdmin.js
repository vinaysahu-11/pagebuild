import admin from 'firebase-admin';
import fs from 'fs';

let db = null;

try {
  if (fs.existsSync('./serviceAccountKey.json')) {
    const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('Firebase Admin Initialized with serviceAccountKey.json');
  } else {
    console.log('No serviceAccountKey.json found. Running Firebase in Mock Mode.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export { db };
