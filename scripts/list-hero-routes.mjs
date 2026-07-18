import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const factions = ['superman', 'technology', 'dark', 'nature', 'god', 'universe'];

const heroes = [];

for (const faction of factions) {
  const path = resolve(`public/data/heroes/${faction}.json`);

  const data = JSON.parse(await readFile(path, 'utf8'));

  heroes.push(...data);
}

const sortedHeroes = heroes.sort((first, second) => first.name.localeCompare(second.name));

for (const hero of sortedHeroes) {
  console.log(`/heroes/${hero.slug}`);
}
