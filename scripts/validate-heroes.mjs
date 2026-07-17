import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const factions = [
  'superman',
  'technology',
  'dark',
  'nature',
  'god',
  'universe',
];

const validTiers = new Set([
  'S+',
  'S',
  'A',
  'B',
]);

const validTypes = new Set([
  'Tank',
  'DPS',
  'Support',
  'Buffer',
  'Debuffer',
  'CC',
  'Healer',
  'True DMG',
  'Holy DMG',
]);

const expectedCounts = {
  superman: 14,
  technology: 16,
  dark: 16,
  nature: 19,
  god: 12,
  universe: 9,
};

const requiredStringFields = [
  'id',
  'slug',
  'name',
  'faction',
  'tier',
];

const requiredArrayFields = [
  'types',
  'statFocus',
  'stigmataFourSet',
  'stigmataTwoSet',
  'collections',
  'artifacts',
  'generalTalentsPvp',
  'gems',
  'gemTalents',
];

const errors = [];
const warnings = [];
const allHeroes = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function validateNonEmptyStrings(
  hero,
  field,
  values,
) {
  values.forEach((value, index) => {
    if (
      typeof value !== 'string' ||
      value.trim().length === 0
    ) {
      addError(
        `${hero.slug}: ${field}[${index}] must be a non-empty string.`,
      );
    }
  });
}

for (const faction of factions) {
  const filePath = resolve(
    `public/data/heroes/${faction}.json`,
  );

  let heroes;

  try {
    const file = await readFile(filePath, 'utf8');
    heroes = JSON.parse(file);
  } catch (error) {
    addError(
      `${faction}: unable to read or parse JSON — ${error.message}`,
    );
    continue;
  }

  if (!Array.isArray(heroes)) {
    addError(`${faction}: root value must be an array.`);
    continue;
  }

  if (heroes.length !== expectedCounts[faction]) {
    addError(
      `${faction}: expected ${expectedCounts[faction]} heroes, found ${heroes.length}.`,
    );
  }

  for (const hero of heroes) {
    allHeroes.push(hero);

    for (const field of requiredStringFields) {
      if (
        typeof hero[field] !== 'string' ||
        hero[field].trim().length === 0
      ) {
        addError(
          `${faction}: hero has invalid or missing "${field}".`,
        );
      }
    }

    if (hero.faction !== faction) {
      addError(
        `${hero.slug ?? hero.name}: faction is "${hero.faction}", but the hero is stored in ${faction}.json.`,
      );
    }

    if (!validTiers.has(hero.tier)) {
      addError(
        `${hero.slug}: invalid tier "${hero.tier}".`,
      );
    }

    if (
      typeof hero.minimumExclusiveEquipment !==
        'number' ||
      hero.minimumExclusiveEquipment < 0
    ) {
      addError(
        `${hero.slug}: minimumExclusiveEquipment must be a non-negative number.`,
      );
    }

    if (
      hero.minimumRelics !== undefined &&
      (
        typeof hero.minimumRelics !== 'number' ||
        hero.minimumRelics < 0
      )
    ) {
      addError(
        `${hero.slug}: minimumRelics must be a non-negative number when present.`,
      );
    }

    for (const field of requiredArrayFields) {
      if (!Array.isArray(hero[field])) {
        addError(
          `${hero.slug}: "${field}" must be an array.`,
        );
        continue;
      }

      validateNonEmptyStrings(
        hero,
        field,
        hero[field],
      );
    }

    for (const type of hero.types ?? []) {
      if (!validTypes.has(type)) {
        addError(
          `${hero.slug}: unsupported hero type "${type}".`,
        );
      }
    }

    if (
      hero.title !== undefined &&
      (
        typeof hero.title !== 'string' ||
        hero.title.trim().length === 0
      )
    ) {
      addError(
        `${hero.slug}: title must be a non-empty string when present.`,
      );
    }

    if (
      hero.notes !== undefined &&
      !Array.isArray(hero.notes)
    ) {
      addError(
        `${hero.slug}: notes must be an array when present.`,
      );
    }

    if (Array.isArray(hero.notes)) {
      validateNonEmptyStrings(
        hero,
        'notes',
        hero.notes,
      );
    }

    if (
      hero.placement === '-' ||
      hero.placement === ''
    ) {
      addWarning(
        `${hero.slug}: placement uses "${hero.placement}". Consider omitting the property instead.`,
      );
    }
  }
}

const duplicateChecks = [
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'slug',
    label: 'slug',
  },
];

for (const check of duplicateChecks) {
  const values = new Map();

  for (const hero of allHeroes) {
    const value = hero[check.field];

    if (!value) {
      continue;
    }

    const existing = values.get(value) ?? [];
    existing.push(hero.name);
    values.set(value, existing);
  }

  for (const [value, heroes] of values) {
    if (heroes.length > 1) {
      addError(
        `Duplicate ${check.label} "${value}" used by: ${heroes.join(', ')}.`,
      );
    }
  }
}

if (allHeroes.length !== 86) {
  addError(
    `Expected 86 heroes in total, found ${allHeroes.length}.`,
  );
}

const countByFaction = Object.fromEntries(
  factions.map((faction) => [
    faction,
    allHeroes.filter(
      (hero) => hero.faction === faction,
    ).length,
  ]),
);

const countByTier = Object.fromEntries(
  [...validTiers].map((tier) => [
    tier,
    allHeroes.filter(
      (hero) => hero.tier === tier,
    ).length,
  ]),
);

console.log('\nHero dataset summary\n');

console.table(countByFaction);
console.table(countByTier);

if (warnings.length > 0) {
  console.log('\nWarnings\n');

  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error(
    `\nValidation failed with ${errors.length} error(s):\n`,
  );

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log(
    `\nValidation successful: ${allHeroes.length} heroes checked.\n`,
  );
}