const { userQueries, userMutations } = require("./resolvers/userResolvers");
const { characterMutations, characterQueries } = require("./resolvers/characterResolvers");
const { encounterQueries, encounterMutations } = require("./resolvers/encounterResolvers");

const resolvers = {
  Query: {
    ...userQueries,
    ...characterQueries,
    ...encounterQueries,
  },
  Mutation: {
    ...userMutations,
    ...characterMutations,
    ...encounterMutations,
  },
};

module.exports = resolvers;
