import { FastifyTypedInstance } from '../../@types/fastify-typed-instance';
import { Session } from '../../@types/session';
import { db } from '../../utils/db';

export function refreshToken(app: FastifyTypedInstance) {
  app.post(
    '/refresh-token',
    {
      schema: {
        description: 'Get a new refresh token',
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return reply
          .status(400)
          .send({ message: 'Refresh token é necessário' });
      }

      try {
        const decoded = app.jwt.verify(refreshToken) as Session;
        const user = await db.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user || user.refreshToken != refreshToken) {
          return reply.status(401).send({
            message: 'Refresh token inválido',
            user: user?.refreshToken,
            refreshToken,
          });
        }

        const data: Session = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerifiedAt: user.emailVerifiedAt,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        const newAccessToken = app.jwt.sign(data, {
          expiresIn: '15m',
        });

        reply
          .setCookie('accessToken', newAccessToken, {
            httpOnly: true, // Protege contra ataques XSS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + 15 * 60 * 1000), // Set expiration date for 15 min
          })
          .send({ accessToken: newAccessToken });
      } catch (err) {
        return reply
          .status(401)
          .send({ message: 'Token inválido ou expirado' });
      }
    }
  );
}
