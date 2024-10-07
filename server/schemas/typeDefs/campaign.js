const { gql } = require('graphql-tag');

const campaignTypeDefs = gql`
  type Campaign {
    _id: ID!
    userId: ID!
    title: String!
    description: String
    npc: [NPC]
    quests: [Quest]
    encounters: [Encounter]
    dungeons: [Dungeon]
  }

  type NPC {
    index: String!
    name: String!
  }

  type Quest {
    _id: ID!
    userId: ID!
    title: String!
    details: String!
    rewards: String!
  }
`;

module.exports = campaignTypeDefs;