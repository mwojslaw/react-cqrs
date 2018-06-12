const cqrs = require("./../index");

const queries = [
  {
    type: "ADD",
    handler: ({ left, right }) => left + right
  },
  {
    type: "MULTIPLE",
    handler: ({ left, right }) => left * right
  }
];

const queryProcessor = cqrs.createQueryProcessor(queries);

test("Should run exprected query", () => {
  const queryResult = queryProcessor.runQuery({
    type: "ADD",
    left: 1,
    right: 2
  });

  expect(queryResult).toEqual([3]);
});

test("Shoud run multiple queries", () => {
  const queryResult = queryProcessor.runQuery(
    {
      type: "ADD",
      left: 1,
      right: 2
    },
    {
      type: "MULTIPLE",
      left: 2,
      right: 2
    }
  );

  expect(queryResult).toEqual([3, 4]);
});

test("Should run expected command", () => {
  const state = [];

  const commands = [
    {
      type: "ADD",
      handler: ({ item }) => state.push(item)
    }
  ];

  const commandProcessor = cqrs.createCommandProcessor(commands);
  commandProcessor.runCommand({
    type: "ADD",
    item: 1
  });
  expect(state).toEqual([1]);
});
