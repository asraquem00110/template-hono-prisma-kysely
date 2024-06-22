import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { faker } from '@faker-js/faker';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUserInDB } from '../__test-utils__/make-fake-user';
import { deleteUserData } from './delete-user';

const dbClient = createTestDbClient();

describe('Delete User', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should delete a user', async () => {
    const testCreatedUser = await createTestUserInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.id).toBe(testCreatedUser.id);

    const deletedUser = await deleteUserData({ dbClient, id: testCreatedUser.id });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(afterUsers.length).toBe(0);
    expect(deletedUser?.id).toBe(testCreatedUser.id);
  });

  it('should return undefined when no user', async () => {
    const deletedUser = await deleteUserData({ dbClient, id: faker.string.uuid() });

    expect(deletedUser).toBeUndefined();
  });
});
