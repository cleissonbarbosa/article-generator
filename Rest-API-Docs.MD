## REST API Documentation

Details about the REST API documentation of the plugin.

---


#### Context Lists API
**URL** - http://localhost/wp-json/article-generator/v1/contexts
**Method** - `GET`
**Middleware** - WordPress user logged in.
**Parameters** -
```
page=1
per_page=10
search=first
orderby=id
order=asc
```
**Full Endpoint** with all of the supported params -
http://localhost/wp-json/article-generator/v1/contexts?page=1&per_page=10&search=first

**API Response**
```json
[
    {
        "id": 1,
        "title": "First Context",
        "slug": "first-context",
        "is_remote": false,
        "status": "available",
        "content": "Article generator is a plugin for wordpress under development, its purpose is to make the technology of the natural language model (GPT) available to wordpress users.",
        "created_at": "2022-07-31 10:05:21",
        "updated_at": "2022-07-31 10:05:21",
        "_links": {
            "self": [
                {
                    "href": "http://localhost/wp-json/article-generator/v1/contexts/1"
                }
            ],
            "collection": [
                {
                    "href": "http://localhost/wp-json/article-generator/v1/contexts"
                }
            ]
        }
    }
]
```

#### Context Detail API
**URL** - http://localhost/wp-json/article-generator/v1/contexts/2
**Method** - `GET`
**Middleware** - WordPress user logged in.
**Response** -
```json
{
    "id": 2,
    "title": "Second Context",
    "slug": "second-context",
    "is_remote": false,
    "status": "available",
    "content": "Generative Pre-Trained Transformer (GPT)",
    "created_at": "2022-07-31 10:05:21",
    "updated_at": "2022-07-31 10:05:21",
    "_links": {
        "self": [
            {
                "href": "http://localhost/wp-json/article-generator/v1/contexts/2"
            }
        ],
        "collection": [
            {
                "href": "http://localhost/wp-json/article-generator/v1/contexts"
            }
        ]
    }
}
```

**Response when context not found** -
```json
{
    "code": "article_gen_rest_context_not_found",
    "message": "Context not found. May be context has been deleted.",
    "data": {
        "status": 404
    }
}
```

#### Context Create API
**URL** - http://localhost/wp-json/article-generator/v1/contexts
**Method** - `POST`
**Middleware** - WordPress user logged in.
**Body** -
```json
{
    "title": "Simple Context Post Awesome",
    "slug": "simple-context-post-awesome",
    "content": "Simple context content",
    "is_active": 1
}
```
**Response** -
```json
{
    "id": 49,
    "title": "Simple Context Post Awesome",
    "slug": "simple-context-post-awesome",
    "is_remote": false,
    "status": "available",
    "content": "Simple context content",
    "created_at": "2022-08-10 21:34:28",
    "updated_at": "2022-08-10 21:34:28",
    "_links": {
        "self": [
            {
                "href": "http://localhost/wp-json/article-generator/v1/contexts/49"
            }
        ],
        "collection": [
            {
                "href": "http://localhost/wp-json/article-generator/v1/contexts"
            }
        ]
    }
}
```
#### Context Update API
**URL** - http://localhost/wp-json/article-generator/v1/contexts/2
**Method** - `PUT`
**Middleware** - WordPress user logged in.
**Body** -
```json
{
    "title": "Simple Context Post Awesome Updated",
    "slug": "simple-context-post-awesome-updated",
    "content": "Simple context content",
    "is_active": 1
}
```

**Response**
```json
{
    "id": 49,
    "title": "Simple Context Post Awesome Updated",
    "slug": "simple-context-post-awesome-updated",
    "is_remote": false,
    "status": "available",
    "content": "Simple context",
    "created_at": "2022-08-10 21:36:09",
    "updated_at": "2022-08-10 21:36:09",
    "_links": {
        "self": [
            {
                "href": "http://localhost/wp-json/article-generator/v1/contexts/49"
            }
        ],
        "collection": [
            {
                "href": "http://localhost/wp-json/article-generator/v1/contexts"
            }
        ]
    }
}
```


#### Contexts Delete API
**URL** - http://localhost/wp-json/article-generator/v1/contexts
**Method** - `DELETE`
**Middleware** - WordPress user logged in.
**Body** -
```json
{
    "ids": [1, 2]
}
```

**Response**
```json
{
    "message": "Contexts deleted successfully.",
    "total": 1
}
```