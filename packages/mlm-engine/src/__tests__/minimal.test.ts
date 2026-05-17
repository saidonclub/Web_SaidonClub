import { describe, it, expect } from 'vitest';
import { prisma } from '@saidonclub/database';

describe('Prisma test', () => {
  it('should be defined', () => {
    console.log('PRISMA IMPORT IS', prisma);
    expect(prisma).toBeDefined();
  });
});
