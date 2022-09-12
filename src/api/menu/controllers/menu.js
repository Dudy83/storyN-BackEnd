'use strict';
const jwt_decode = require("jwt-decode");

/**
 *  menu controller
 */

const {
  createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::menu.menu',
  ({
    strapi
  }) => ({

    async fetchStructuredMenu(ctx) {
      // console.log('ctx.request.header.authorization', ctx.request.header.authorization);
      // let decoded = jwt_decode(ctx.request.header.authorization);
      const menuId = ctx.params.id;
      let stories = [];
      let categStories = [];
      let breadcrumb = [];
      let count = 0;

      if(!menuId) {
        return ctx.badRequest('No id given');
      }

      const findArticles = (articles, id) => {
        const art = articles ? articles.filter(el => el.category && el.category.id === id) : [];
        if(art.length > 0) art.forEach((a) => stories.push(a));
        
        return art;
      }

      const findChildren = (articles, categories, id, parentId) => {
        if(parentId == null) {
          if(count != 0) (categStories[count-2] = stories, stories = [])
          count++;
        }

        const results = [];
        const children = categories.filter(el => ((el.parentCategory && el.parentCategory.id === id) || id == null && el.parentCategory == null));
        
        children.forEach((child) => {
          results.push({
            ...child,
            children: findChildren(articles, categories, child.id, child.parentCategory),
            articles: findArticles(articles, child.id)
          });
        });

        return results;
      };

      const menu = await strapi.entityService.findOne('api::menu.menu', menuId, {
        populate: {
          owner: {
            fields: ["id"]
          },
        },
        fields: ['name']
      })

      if(menu === null) {
          return ctx.notFound('No menu found');
      }

      const ownerId = menu.owner.id;

      const categories = await strapi.entityService.findMany('api::category.category', {
        where: {
          owner: ownerId,
          menu: menuId
        },
        populate: {
          parentCategory: {
            fields: ["id"]
          },
          categorySuggestion: {
            fields: ["id"]
          },
          cover: {
            fields: ["placeholder", "url"]
          }
        },
      })

      const articles = await strapi.entityService.findMany('api::article.article', {
        where: {
          owner: ownerId,
          menu: menuId
        },
        populate: {
          category: {
            fields: ["id"]
          },
          story: {
            populate: {
              content: {
                fields: ["placeholder", "url"]
              }
            }
          }
        },
      })


      const findBreadcrumb = (article, category = null) => {
        let parent;

        if (category == null) 
          parent = categories.find(x => x.id == article.category.id);

        else 
          parent = categories.find(x => x.id == category.parentCategory.id);

        breadcrumb.unshift(parent.name)

        if(parent.parentCategory !== null) findBreadcrumb(article, parent);
      }

      articles.forEach(article => {
        findBreadcrumb(article);
        article.breadcrumb = breadcrumb;
        breadcrumb = [];
      })

      const result = findChildren(articles, categories, null, null);
      categStories[categStories.length] = stories;
      result.forEach((res, i) => res.stories = categStories[i]);
      menu.content = result;
  
      ctx.send(menu)
    },
  }));
