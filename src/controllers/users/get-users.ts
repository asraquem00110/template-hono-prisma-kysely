import { getUsersData } from '@/data/user/get-users';
import { userSchema } from '@/data/user/schema';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getUsersSchema = {
  query: z.object({
    limit: z.number().optional(),
    page: z.number().optional(),
    sort_by: z.string().optional(),
    order_by: z.enum(['asc', 'desc']).optional(),
  }),
  response: z.object({
    records: z.array(userSchema),
    total_records: z.number(),
  }),
};

export type GetUsersQuery = z.infer<typeof getUsersSchema.query>;
export type GetUsersResponse = z.infer<typeof getUsersSchema.response>;

export const getUsersRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/users',
  tags: ['Users'],
  description: 'List of users',
  request: {
    query: getUsersSchema.query,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUsersSchema.response,
        },
      },
      description: 'Users retrieved successfully',
    },
  },
});

export const getUsersHandler: Handler = async c => {
  const dbClient = c.get('dbClient');

  const data = await getUsersData({ dbClient });

  return c.json<GetUsersResponse>(
    {
      records: data.records,
      total_records: data.totalRecords,
    },
    { status: 200 }
  );
};
