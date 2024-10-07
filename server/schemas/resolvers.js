const { userQueries, userMutations } = require("./resolvers/userResolvers");
const { characterMutations, characterQueries } = require("./resolvers/characterResolvers");
const { encounterQueries, encounterMutations } = require("./resolvers/encounterResolvers");
const { questQueries, questMutations } = require("./resolvers/questResolvers");
const { dungeonQueries, dungeonMutations } = require("./resolvers/dungeonResolvers");
const { campaignQueries, campaignMutations } = require("./resolvers/campaignResolvers");
const { aiMutations } = require("./resolvers/aiResolvers");

const resolvers = {
  Query: {
    ...userQueries,
    ...characterQueries,
    ...encounterQueries,
    ...questQueries,
    ...dungeonQueries,
    ...campaignQueries,
  },
  Mutation: {
    ...userMutations,
    ...characterMutations,
    ...encounterMutations,
    ...questMutations,
    ...dungeonMutations,
    ...campaignMutations,
    ...aiMutations,
  },
};

module.exports = resolvers;