import { describe, it, beforeAll, afterAll } from 'vitest';
import db from '@saidonclub/database';
const { prisma } = db;

describe('Debug Hooks', () => {
  beforeAll(() => {
    console.log('BEFORE_ALL PRISMA:', typeof prisma);
  });

  afterAll(() => {
    console.log('AFTER_ALL PRISMA:', typeof prisma);
  });

  it('test', () => {
    console.log('TEST PRISMA:', typeof prisma);
  });
});
