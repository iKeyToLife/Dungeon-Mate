const { gql } = require('graphql-tag');

const campaignTypeDefs = gql`
  type Campaign {
    _id: ID!
    userId: ID!
    title: String!
    description: String
    npcs: String
    notes: String
    creatures: [Creature]!
    encounters: [Encounter]!
    quests: [Quest]!
    dungeons: [Dungeon]!
  }

  type Creature {
    index: String!
    name: String!
  }

input CreatureInput {
  index: String!
  name: String!
}
`;

module.exports = campaignTypeDefs;