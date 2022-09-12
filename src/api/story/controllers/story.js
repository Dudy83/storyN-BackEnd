'use strict';

/**
 *  story controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::story.story',
  ({
    strapi
  }) => ({
    async getArticleStory(ctx) {
      const idMenu = ctx.params.idMenu;
      const idArticle = ctx.params.idArticle;
      const id = ctx.params.id;

      if (!Number(idMenu) || !Number(idArticle) || !Number(id)) {
        return ctx.badRequest('name is missing', { foo: 'bar' })
      }

      const story = await strapi.entityService.findOne('api::story.story', id, {
        fields: ["id"],
        populate: {
          content: {
            fields: ["url"]
          }
        },
        where: {
          menu: idMenu,
          articles: idArticle
        },
      });

      if(story) return ctx.send(story);
      else return ctx.notFound('No story found');
      
    },

    async getCategoryStory(ctx) {
        const idMenu = ctx.params.idMenu;
        const idCategory = ctx.params.idCategory;
        const id = ctx.params.id;
  
        if (!Number(idMenu) || !Number(idCategory) || !Number(id)) {
          return ctx.badRequest('need integer')
        }
  
        const story = await strapi.entityService.findOne('api::story.story', id, {
          fields: ["id"],
          populate: {
            content: {
              fields: ["url"]
            }
          },
          where: {
            menu: idMenu,
            categories: idCategory
          },
        });
  

        if(story) return ctx.send(story);
        else return ctx.notFound('No story found');
      },
  }));
