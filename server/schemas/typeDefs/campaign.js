const { gql } = require('graphql-tag');

const campaignTypeDefs = gql`
  type Campaign {
    _id: ID!
    userId: ID!
    title: String!
    description: String
    npcs: [NPC]
    notes: [Note]
    creatures: [Creature]!
    encounters: [Encounter]!
    quests: [Quest]!
    dungeons: [Dungeon]!
  }

  type Creature {
    index: String!
    name: String!
  }

  type NPC {
    description: String!
  }

  type Note {
    description: String!
  }

  input NpcInput {
  description: String
}

input NoteInput {
  description: String
}

input CreatureInput {
  index: String!
  name: String!
}
`;

module.exports = campaignTypeDefs;