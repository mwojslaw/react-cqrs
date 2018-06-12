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

const cqrsMiddlewere = (commandProcessor, queryProcessor) => (
  req,
  res,
  next
) => {
  if (req.path === "/query") {
    const { query } = req;
    const data = queryProcessor.runQuery(...JSON.parse(query.query));
    res.send({
      data
    });
  } else if (req.path === "/command") {
    const { body } = req;
    res.send({
      data: commandProcessor.runCommand(body.type, body)
    });
  } else next();
};

module.exports = {
  createQueryProcessor,
  createCommandProcessor,
  cqrsMiddlewere
};
