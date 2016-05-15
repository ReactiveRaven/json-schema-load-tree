import deepPluck from "deep-pluck";
import fetch from "isomorphic-fetch";
import { Promise } from "es6-promise";
import { Injector } from "infuse.js";
export const container = new Injector();

// add external modules to DI container
(
    items => Object.keys(items)
        .forEach(key => container.mapValue(key, items[key]))
)({
    deepPluck,
    fetch,
    Promise
});

// Load our stuff in
require("./expandSchema").injection(container);
require("./schemaFetcher").injection(container);

// infuse!
export default () => container.getValue("expandSchema");
