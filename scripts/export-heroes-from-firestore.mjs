// Dumps the live Firestore `heroes` collection back to the static
// public/data/heroes/*.json files. Firestore is the source of truth for hero data;
// this snapshot exists so scripts/validate-heroes.mjs (and anyone browsing the repo
// without Firebase access) still has an up-to-date, checked-in copy of the dataset.
// Run via `npm run sync:heroes`, which also runs validate:data against the result.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json node scripts/export-heroes-from-firestore.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as prettier from 'prettier';

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

const snapshot = await firestore.collection('heroes').get();
const heroes = snapshot.docs.map((doc) => doc.data());

for (const faction of factions) {
  const factionHeroes = heroes
    .filter((hero) => hero.faction === faction)
    .sort((first, second) => first.name.localeCompare(second.name));

  const filePath = resolve(`public/data/heroes/${faction}.json`);

  const formatted = await prettier.format(JSON.stringify(factionHeroes), {
    filepath: filePath,
    ...(await prettier.resolveConfig(filePath)),
  });

  await writeFile(filePath, formatted, 'utf8');
}

console.log(`Exported ${heroes.length} heroes from Firestore to public/data/heroes/*.json.`);
