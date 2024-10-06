const { userQueries, userMutations } = require("./resolvers/userResolvers");
const { characterMutations, characterQueries } = require("./resolvers/characterResolvers");
const { encounterQueries, encounterMutations } = require("./resolvers/encounterResolvers");
const { questQueries, questMutations } = require("./resolvers/questResolvers");

const resolvers = {
  Query: {
    ...userQueries,
    ...characterQueries,
    ...encounterQueries,
    ...questQueries
  },
  Mutation: {
    ...userMutations,
    ...characterMutations,
    ...encounterMutations,
    ...questMutations
  },
};

module.exports = resolvers;
