import { OpenAPIHono } from '@hono/zod-openapi';
import usersRouter from '@api/routes/users/index';
import authRouter from '@api/routes/auth/index';

const apiRoutes = new OpenAPIHono();
apiRoutes.route('/users', usersRouter);
apiRoutes.route('/auth', authRouter);
export { apiRoutes };
