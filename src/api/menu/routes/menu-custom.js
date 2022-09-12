'use strict';

/**
 * menu custom router.
 */


module.exports = {
    routes: [
        {
            "method": "GET",
            "path": "/menu/:id",
            "handler": "menu.fetchStructuredMenu",
            "config": {
                "policies": []
            }
        },

    ]
}