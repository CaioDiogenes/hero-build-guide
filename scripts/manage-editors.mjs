// Manages the Firestore /editors allowlist that firestore.rules checks before
// allowing hero writes (see isEditor() in firestore.rules). Editors are looked
// up by email via Firebase Auth, then granted/revoked by adding/removing a doc
// at editors/{uid} — this collection is not client-writable, so this script
// (or the Firebase console) is the only way to change who can edit.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/manage-editors.mjs add someone@example.com
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/manage-editors.mjs remove someone@example.com
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/manage-editors.mjs list
//
// Note: a person must have signed into the app at least once (so a Firebase
// Auth user record exists for their email) before they can be added.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  console.error(
    'Set GOOGLE_APPLICATION_CREDENTIALS to the path of a Firebase service account key JSON file.',
  );
  process.exit(1);
}

const [command, email] = process.argv.slice(2);

if (!['add', 'remove', 'list'].includes(command ?? '')) {
  console.error('Usage: node scripts/manage-editors.mjs <add|remove|list> [email]');
  process.exit(1);
}

if ((command === 'add' || command === 'remove') && !email) {
  console.error(`Usage: node scripts/manage-editors.mjs ${command} <email>`);
  process.exit(1);
}

const serviceAccount = JSON.parse(await readFile(resolve(credentialsPath), 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const firestore = getFirestore();

if (command === 'list') {
  const snapshot = await firestore.collection('editors').get();

  if (snapshot.empty) {
    console.log('No editors are currently allowlisted.');
  } else {
    console.log(`${snapshot.size} editor(s):`);

    for (const editorDoc of snapshot.docs) {
      console.log(`- ${editorDoc.data().email ?? '(no email on record)'} (uid: ${editorDoc.id})`);
    }
  }

  process.exit(0);
}

const user = await auth.getUserByEmail(email).catch(() => undefined);

if (!user) {
  console.error(
    `No Firebase Auth user found for "${email}". They must sign into the app at least once first.`,
  );
  process.exit(1);
}

if (command === 'add') {
  await firestore.collection('editors').doc(user.uid).set({ email: user.email });
  console.log(`Granted edit access to ${user.email} (uid: ${user.uid}).`);
} else {
  await firestore.collection('editors').doc(user.uid).delete();
  console.log(`Revoked edit access from ${user.email} (uid: ${user.uid}).`);
}
