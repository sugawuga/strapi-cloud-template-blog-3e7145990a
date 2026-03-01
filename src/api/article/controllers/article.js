'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  async create(ctx) {
    // strip empty media relations and capture timestamps
    const timestamps = {};
    if (ctx.request && ctx.request.body && ctx.request.body.data) {
      ['createdAt','updatedAt','publishedAt'].forEach(k => {
        if (ctx.request.body.data[k]) {
          timestamps[k] = ctx.request.body.data[k];
          delete ctx.request.body.data[k];
        }
      });
      if (ctx.request.body.data.image === '') {
        delete ctx.request.body.data.image;
      }
    }

    await super.create(ctx);

    // allow any properties
    const resBody = /** @type {any} */ (ctx.body);
    if (resBody && resBody.data && Object.keys(timestamps).length) {
      try {
        const id = resBody.data.id;
        await strapi.entityService.update('api::article.article', id, { data: timestamps });
        ctx.body = await strapi.entityService.findOne('api::article.article', id, { populate: '*' });
      } catch (err) {
        strapi.log.error('[article.controller] applying timestamps failed', err);
      }
    }

    return ctx.body;
  },

  async update(ctx) {
    const timestamps = {};
    if (ctx.request && ctx.request.body && ctx.request.body.data) {
      ['createdAt','updatedAt','publishedAt'].forEach(k => {
        if (ctx.request.body.data[k]) {
          timestamps[k] = ctx.request.body.data[k];
          delete ctx.request.body.data[k];
        }
      });
      if (ctx.request.body.data.image === '') {
        delete ctx.request.body.data.image;
      }
    }

    await super.update(ctx);

    const resBody = /** @type {any} */ (ctx.body);
    if (resBody && resBody.data && Object.keys(timestamps).length) {
      try {
        const id = resBody.data.id;
        await strapi.entityService.update('api::article.article', id, { data: timestamps });
        ctx.body = await strapi.entityService.findOne('api::article.article', id, { populate: '*' });
      } catch (err) {
        strapi.log.error('[article.controller] applying timestamps on update failed', err);
      }
    }

    return ctx.body;
  },
}));
