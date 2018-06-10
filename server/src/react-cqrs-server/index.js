const createQueryProcessor = queries => ({
    runQuery: (type, params) => queries.find(q => q.type === type).handler(params)
});

const withQuery = (queryProcessor, type) => (req, res) => {
    const { query } = req;

    res.send(queryProcessor.runQuery(query.type, query));
};

module.exports = {
    withQuery,
    createQueryProcessor
};