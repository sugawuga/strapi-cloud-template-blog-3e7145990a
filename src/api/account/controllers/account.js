'use strict';

const jwtLib = require('jsonwebtoken');

module.exports = {
  async me(ctx) {
    try {
      const auth = ctx.request.header.authorization || '';
      const parts = auth.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return ctx.unauthorized('Missing token');
      }

      const token = parts[1];

      const secret = (strapi.config.get && (strapi.config.get('plugin.users-permissions.jwtSecret') || strapi.config.get('plugin.users-permissions.jwt_secret'))) || process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || null;
      if (!secret) {
        strapi.log.error('[account.me] JWT secret not configured');
        return ctx.internalServerError('JWT secret not configured');
      }

      let payload;
      try {
        payload = jwtLib.verify(token, String(secret));
      } catch (err) {
        strapi.log.warn('[account.me] Token verification failed:', err && err.message ? err.message : err);
        return ctx.unauthorized('Invalid token');
      }

      if (!payload || typeof payload === 'string' || !('id' in payload)) {
        return ctx.unauthorized('Invalid token payload');
      }

      const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: payload.id }, populate: ['role'] });
      if (!user) return ctx.unauthorized('User not found');

      const sanitized = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      return ctx.send({ data: sanitized });
    } catch (err) {
      strapi.log.error('[account.me] Unexpected error', err && (err.stack || err));
      return ctx.internalServerError('Could not fetch account');
    }
  },
};