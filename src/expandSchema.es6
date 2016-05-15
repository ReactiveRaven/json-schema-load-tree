const normaliseRefs = parentPath => {
    const root = parentPath.split("/").slice(0,3);
    const dir = parentPath.split("/").slice(0, -1).join("/") + "/";

    return refs =>
        refs
            // ignore self-references
            .filter(ref => ref.indexOf("#") !== 0)
            // ignore drilldowns, only interested in files to load
            .map(ref => ref.split("#")[0])
            // remove duplicates
            .filter((ref, idx, arr) => arr.indexOf(ref) === idx)
            .map(ref => {
                if (ref.indexOf("/") === 0) {
                    return root + ref;
                } else if (ref.indexOf("://") > -1) {
                    return ref;
                } else {
                    return dir + ref;
                }
            });
};

const expandSchema = (schemaFetcher, Promise, deepPluck) =>
    schemaRef => new Promise((resolve, reject) => {
        const foundSchemas = {};

        const loadSchemaDependencies = schemaContent => Promise.all(
                normaliseRefs(schemaContent.id)(deepPluck(schemaContent, "$ref"))
                    .filter(ref => foundSchemas[ref] === undefined)
                    .map(ref =>
                        schemaFetcher(ref)
                            .then(schemaContent => {
                                foundSchemas[ref] = schemaContent;
                                if (schemaContent.id === undefined) {
                                    schemaContent.id = ref;
                                }

                                return schemaContent;
                            })
                    )
            )
                .then(newSchemas => Promise.all(
                    newSchemas
                        .map(schemaContent => loadSchemaDependencies(schemaContent))
                ));

        (
            typeof schemaRef === "string" ?
                schemaFetcher(schemaRef) :
                Promise.resolve(schemaRef)
        )
            .then(schemaContent => foundSchemas[schemaContent.id] = schemaContent)
            .then(loadSchemaDependencies)
            .then(() => resolve(foundSchemas), reject);
    });

export const injection = container => container.mapClass("expandSchema", expandSchema, true);

export default expandSchema;
