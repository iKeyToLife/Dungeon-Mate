const { gql } = require('graphql-tag');

const dungeonTypeDefs = gql`
  type Dungeon {
    _id: ID!
    userId: ID!
    title: String!
    description: String
    encounters: [Encounter]
  }

  input RoomTypesInput {
    traps: Int!
    enemies: Int!
    treasure: Int!
    corridors: Int!
  }
`;

module.exports = dungeonTypeDefs;