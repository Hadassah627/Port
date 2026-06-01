import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';

const args = Object.fromEntries(
  process.argv.slice(2).map((entry) => {
    const trimmed = entry.replace(/^--/, '');
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      return [trimmed, 'true'];
    }
    return [trimmed.slice(0, equalsIndex), trimmed.slice(equalsIndex + 1)];
  }),
);

const uid = args.uid ?? process.env.ADMIN_UID;
const email = args.email ?? process.env.ADMIN_EMAIL;
const displayName = args.displayName ?? process.env.ADMIN_DISPLAY_NAME ?? 'Administrator';
const role = args.role ?? 'admin';
const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;

if (!uid) {
  throw new Error('Missing uid. Pass --uid=<firebase-auth-uid> or set ADMIN_UID.');
}

if (!projectId) {
  throw new Error('Missing project id. Set FIREBASE_PROJECT_ID or GCLOUD_PROJECT.');
}

if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (serviceAccountJson) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
      projectId,
    });
  } else if (credentialsPath) {
    const absolutePath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', credentialsPath);
    const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
  }
}

const firestore = admin.firestore();

const profile = {
  uid,
  email: email ?? '',
  displayName,
  role,
  photoUrl: '',
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

await firestore.collection('users').doc(uid).set(profile, { merge: true });

console.log(`Created users/${uid} with role=${role}`);
