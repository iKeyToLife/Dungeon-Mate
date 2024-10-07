const { userQueries, userMutations } = require("./resolvers/userResolvers");
const { characterMutations, characterQueries } = require("./resolvers/characterResolvers");
const { encounterQueries, encounterMutations } = require("./resolvers/encounterResolvers");
const { questQueries, questMutations } = require("./resolvers/questResolvers");
const { dungeonQueries, dungeonMutations } = require("./resolvers/dungeonResolvers");

const resolvers = {
  Query: {
    ...userQueries,
    ...characterQueries,
    ...encounterQueries,
    ...questQueries,
    ...dungeonQueries
  },
  Mutation: {
    ...userMutations,
    ...characterMutations,
    ...encounterMutations,
    ...questMutations,
    ...dungeonMutations
  },
};

module.exports = resolvers;
