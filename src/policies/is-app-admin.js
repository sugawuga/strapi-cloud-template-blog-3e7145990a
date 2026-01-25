module.exports = async (ctx, next) => {
  const { user } = ctx.state;

  if (!user) {
    strapi.log.warn('[is-app-admin] unauthorized: no user in ctx.state');
    return ctx.unauthorized('Authentication required');
  }

  // Allow-all toggle: set ALLOW_ALL_AUTH_USERS_AS_ADMIN=true to grant every authenticated user access.
  // This must be explicitly set to the string 'true' to enable; default is strict role-based enforcement.
  const envAllowAll = process.env.ALLOW_ALL_AUTH_USERS_AS_ADMIN;
  const allowAll = envAllowAll === 'true';

  if (allowAll) {
    strapi.log.warn('[is-app-admin] ALLOW_ALL_AUTH_USERS_AS_ADMIN enabled (explicit) - allowing all authenticated users');
    return await next();
  }

  const role = user.role || (user.roles && user.roles[0]);
  strapi.log.debug(`[is-app-admin] detected role: ${role ? JSON.stringify({ id: role.id, type: role.type, name: role.name }) : 'none'}`);

  const isAppAdmin = role && (role.type === 'app-admin' || role.name === 'App Admin');
  strapi.log.debug(`[is-app-admin] isAppAdmin: ${!!isAppAdmin}`);

  if (!isAppAdmin) {
    strapi.log.warn(`[is-app-admin] forbidden for user ${user.email}`);
    return ctx.forbidden('Insufficient permissions');
  }

  await next();
};