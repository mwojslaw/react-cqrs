const createQueryProcessor = queries => ({
  runQuery: (type, params) => queries.find(q => q.type === type).handler(params)
});

const createCommandProcessor = commands => ({
  runCommand: (type, params) =>
    commands.find(c => c.type === type).handler(params)
});

const withQuery = queryProcessor => (req, res) => {
  const { query } = req;

  res.send({
    data: queryProcessor.runQuery(query.type, query)
  });
};

const withCommand = commandProcessor => (req, res) => {
  const { body } = req;
  res.send({
    data: commandProcessor.runCommand(body.type, body)
  });
};

module.exports = {
  withQuery,
  withCommand,
  createQueryProcessor,
  createCommandProcessor
};
