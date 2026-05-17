import * as db from '@saidonclub/database';
import { test } from 'vitest';

test('debug prisma import', () => {
  const keys = Object.keys(db);
  console.log('PRISMA IN KEYS?', keys.includes('prisma'));
  console.log('PRISMA VALUE:', db.prisma);
  console.log('ALL KEYS:', keys);
});
