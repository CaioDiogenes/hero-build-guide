// One-time migration: seeds the Firestore `heroes` collection from the static
// public/data/heroes/*.json files. Run this once against a fresh Firestore database
// (see Phase 2 of the collaborative-editing plan) — afterward, Firestore is the live
// source of truth and this script should not be run again against a database that
// already has contributor edits, since it will overwrite those docs.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/migrate-heroes-to-firestore.mjs

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const factions = ['superman', 'technology', 'dark', 'nature', 'god', 'universe'];

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  console.error(
    'Set GOOGLE_APPLICATION_CREDENTIALS to the path of a Firebase service account key JSON file.',
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(await readFile(resolve(credentialsPath), 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore();

const heroes = [];

for (const faction of factions) {
  const filePath = resolve(`public/data/heroes/${faction}.json`);
  const data = JSON.parse(await readFile(filePath, 'utf8'));
  heroes.push(...data);
}

const batch = firestore.batch();

for (const hero of heroes) {
  const docRef = firestore.collection('heroes').doc(hero.slug);
  batch.set(docRef, hero);
}

await batch.commit();

console.log(`Migrated ${heroes.length} heroes to Firestore.`);
