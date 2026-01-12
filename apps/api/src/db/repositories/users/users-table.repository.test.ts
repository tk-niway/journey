import { describe, it, expect, beforeEach } from 'vitest';
import { databaseService } from '@db/database.service';
import { UsersTableRepository } from './users-table.repository';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';
import { testRepository } from '../test/test.repository';
import { usersTable } from '@db/schemas/users-table.schema';
import { userCredentialsTable } from '@db/schemas/user-credentials-table.schema';

describe('UsersTableRepository', () => {
  const repository = new UsersTableRepository(databaseService);

  beforeEach(async () => {
    // Delete dependent table first
    await databaseService.delete(userCredentialsTable);
    await databaseService.delete(usersTable);
  });

  describe('create', () => {
    it('should create a user and credential', async () => {
      const userEntity = UserTestFactory.createUserEntity();
      const created = await repository.create(userEntity);

      // Verify non-date fields
      expect(created.values).toMatchObject({
        id: userEntity.values.id,
        name: userEntity.values.name,
        email: userEntity.values.email,
      });
      // SQLite truncates milliseconds
      expect(
        Math.abs(
          created.values.createdAt.getTime() -
            userEntity.values.createdAt.getTime()
        )
      ).toBeLessThan(1000);

      expect(created.credential).toMatchObject({
        id: userEntity.credential.id,
        userId: userEntity.credential.userId,
        hashedPassword: userEntity.credential.hashedPassword,
      });

      const found = await testRepository.findUserByEmail(
        userEntity.values.email
      );
      expect(found).toBeDefined();
      expect(found!.id).toBe(userEntity.values.id);
    });
  });

  describe('findById', () => {
    it('should return null if user not found', async () => {
      const result = await repository.findById('non-existent');
      expect(result).toBeNull();
    });

    it('should return user if found', async () => {
      // Create user but ensure dates are rounded to seconds to match SQLite behavior
      const userEntity = UserTestFactory.createUserEntity();
      // Adjust entity dates to remove milliseconds to match what DB will store/return
      userEntity.values.createdAt.setMilliseconds(0);
      userEntity.values.updatedAt.setMilliseconds(0);
      userEntity.credential.createdAt.setMilliseconds(0);
      userEntity.credential.updatedAt.setMilliseconds(0);

      await testRepository.createUser(userEntity);

      const result = await repository.findById(userEntity.values.id);
      expect(result).toBeDefined();
      expect(result!.values).toEqual(userEntity.values);
    });
  });

  describe('findByEmail', () => {
    it('should return null if user not found', async () => {
      const result = await repository.findByEmail('non-existent@example.com');
      expect(result).toBeNull();
    });

    it('should return user if found', async () => {
      const userEntity = UserTestFactory.createUserEntity();
      userEntity.values.createdAt.setMilliseconds(0);
      userEntity.values.updatedAt.setMilliseconds(0);
      userEntity.credential.createdAt.setMilliseconds(0);
      userEntity.credential.updatedAt.setMilliseconds(0);

      await testRepository.createUser(userEntity);

      const result = await repository.findByEmail(userEntity.values.email);
      expect(result).toBeDefined();
      expect(result!.values).toEqual(userEntity.values);
    });
  });
});
