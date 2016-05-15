beforeEach(function() {
    jasmine.knownSchemas = {
        "http://www.example.com/blog-post.json": {
            "id": "http://www.example.com/blog-post.json",
            "type": "object",
            "properties": {
                "id": { "type": "number" },
                "author": { "type": "string" },
                "title": { "type": "string" },
                "body": { "type": "string" },
                "metadata": { "$ref": "http://www.example.com/metadata.json" }
            },
            "required": [ "title", "author", "id" ]
        },
        "http://www.example.com/metadata.json": {
            "id": "http://www.example.com/metadata.json",
            "type": "object",
            "properties": {
                "created": { "$ref": "types.json#/definitions/timestamp" }
            }
        },
        "http://www.example.com/types.json": {
            "id": "http://www.example.com/types.json",
            "definitions": {
                "timestamp": {
                    "type": "number",
                    "description": "UTC Unix timestamp"
                }
            }
        }
    };
});
