module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/story/article/:idMenu/:idArticle/:id",
            "handler": "story.getArticleStory",
            "config": {
                "policies": []
            }
        },
        {
            "method": "GET",
            "path": "/story/category/:idMenu/:idCategory/:id",
            "handler": "story.getCategoryStory",
            "config": {
                "policies": []
            }
        },
    ]
}