const schemaFetcher = (fetch, Promise) => {
    const schemaMap = {};

    return (url) => {
        if (schemaMap[url]) {
            return Promise.resolve(schemaMap[url]);
        } else {
            schemaMap[url] = fetch(url).then(connection => {
                if (!connection.ok) {
                    throw new Error("Failed to fetch '" + url + "' with status '" + connection.status + "'");
                }
                return connection.json();
            });
            schemaMap[url].catch(() => delete schemaMap[url]);
            return schemaMap[url];
        }
    };
};

export const injection = container => container.mapClass("schemaFetcher", schemaFetcher, true);

export default schemaFetcher;
