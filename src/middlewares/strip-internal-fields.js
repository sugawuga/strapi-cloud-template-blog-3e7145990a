'use strict';

/**
 * Global middleware to strip read-only Strapi fields (createdAt, updatedAt, publishedAt)
 * from incoming requests to prevent ValidationErrors.
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Debug log to see if middleware is even hit
    console.log(`[Middleware] Incoming ${ctx.method} request to ${ctx.url}`);

    if (ctx.request.body && ctx.request.body.data) {
      // Use the actual reference to ensure modification persists
      const data = ctx.request.body.data;
      
      const fieldsToRemove = ['createdAt', 'updatedAt', 'publishedAt', 'id'];
      
      fieldsToRemove.forEach(field => {
        if (data[field] !== undefined) {
          console.log(`[Middleware] Stripping field: ${field}`);
          delete data[field];
        }
      });
    }

    await next();
  };
};
