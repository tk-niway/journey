import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserApplication } from './user.application';
import { UsersTableRepository } from '@db/repositories/users/users-table.repository';
import { UserTestFactory } from '@domains/user/factories/user.test-factory';

// Mock the repository module
vi.mock('@db/repositories/users/users-table.repository', () => {
  const UsersTableRepository = vi.fn();
  UsersTableRepository.prototype.findById = vi.fn();
  return { UsersTableRepository };
});

// Mock database service to avoid connection
vi.mock('@db/database.service', () => ({
  databaseService: {},
  DatabaseService: class {},
}));

describe('UserApplication', () => {
  let application: UserApplication;
  let mockRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    application = new UserApplication();
    // Get the mock instance
    mockRepository = (UsersTableRepository as any).mock.instances[0];
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      const userEntity = UserTestFactory.createUserEntity();
      mockRepository.findById.mockResolvedValue(userEntity);

      const result = await application.findUserById('some-id');
      expect(result).toEqual(userEntity);
      expect(mockRepository.findById).toHaveBeenCalledWith('some-id');
    });

    it('should return null when not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await application.findUserById('some-id');
      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('some-id');
    });
  });
});
