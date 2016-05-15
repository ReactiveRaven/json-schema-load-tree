var expandSchema = require("../lib/expandSchema").default;
var injection = require("../lib/expandSchema").injection;
var infusejs = require("infuse.js");
var utils = require("./_utils");
var deepPluck = require("deep-pluck");

describe("expandSchema", function() {
    var container;
    var fakeSchemaFetcher;

    var exampleSchemaUrl;

    var knownUrls;

    beforeEach(function() {

        exampleSchemaUrl = "http://www.example.com/blog-post.json";

        knownUrls = {
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

        fakeSchemaFetcher = jasmine.createSpy("fakeSchemaFetcher")
            .and.callFake(url => {
                var found = knownUrls[url];
                if (found) {
                    return utils.PromiseSync.resolve(found);
                } else {
                    return utils.PromiseSync.reject("TEST: URL NOT FOUND");
                }
            });
        container = new infusejs.Injector();
        container.mapValue("deepPluck", deepPluck);
        container.mapValue("Promise", utils.PromiseSync);
        container.mapValue("schemaFetcher", fakeSchemaFetcher);
    });

    it("should be a function", function() {
        expect(expandSchema).toEqual(jasmine.any(Function));
    });

    it("should map itself on 'injection'", function() {
        var mapName = "expandSchema";
        expect(container.hasMapping(mapName)).toBe(false);

        injection(container);

        expect(container.hasMapping(mapName)).toBe(true);

        expect(container.getValue(mapName)).toEqual(jasmine.any(Function));
    });

    it("should load child refs and return a structure containing all schemas", function() {
        injection(container);
        var expandSchema = container.getValue("expandSchema");

        var result = expandSchema(exampleSchemaUrl);

        expect(result._catch).toBeUndefined();
        expect(JSON.stringify(result._then)).toBe(JSON.stringify(knownUrls));
    });
});
