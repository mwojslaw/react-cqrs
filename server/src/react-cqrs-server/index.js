const createQueryProcessor = queries => ({
  runQuery: (...q) =>
    q.reduce(
      (previous, c) => [
        ...previous,
        queries.find(x => x.type === c.type).handler({ ...c }, { previous })
      ],
      []
    )
});

const createCommandProcessor = commands => ({
  runCommand: command =>
    commands.find(c => c.type === command.type).handler(command)
});

const withQuery = queryProcessor => (req, res) => {
  const { query } = req;

  res.send({
    data: queryProcessor.runQuery(...JSON.parse(query.query))
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
