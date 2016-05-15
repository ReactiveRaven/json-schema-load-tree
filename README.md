# json-schema-load-tree

Loads all references in a [json schema](http://json-schema.org/), recursively. Currently a work in progress.

[![Stability:Experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square&maxAge=2592000)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![NPM Version](https://img.shields.io/npm/v/json-schema-load-tree.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/json-schema-load-tree)
[![Travis](https://img.shields.io/travis/ReactiveRaven/json-schema-load-tree.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/ReactiveRaven/json-schema-load-tree)
[![Issues](https://img.shields.io/github/issues/reactiveraven/json-schema-load-tree.svg?style=flat-square&maxAge=3600)](https://github.com/reactiveraven/json-schema-load-tree/issues)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square&maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square&maxAge=2592000)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/npm/l/json-schema-load-tree.svg?style=flat-square&maxAge=2592000)](http://spdx.org/licenses/MIT)
[![Maintenance](https://img.shields.io/maintenance/yes/2016.svg?maxAge=2592000&style=flat-square&maxAge=2592000)](https://github.com/reactiveraven/json-schema-load-tree/issues)
[![Downloads](https://img.shields.io/npm/dm/json-schema-load-tree.svg?style=flat-square&maxAge=25200)](https://www.npmjs.com/package/json-schema-load-tree)

**Installation:**

```shell
npm install json-schema-load-tree
```

**Usage:**

example.js
```js
import jsonSchemaLoadTree from 'json-schema-load-tree';

jsonSchemaLoadTree("http://www.example.com/blog-post.json")
    .then(result => console.log(result));
```

Output:

```json
{
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
}
```
