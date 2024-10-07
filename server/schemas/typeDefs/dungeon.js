const { gql } = require('graphql-tag');

const dungeonTypeDefs = gql`
  type Dungeon {
    _id: ID!
    title: String!
    description: String
    encounters: [Encounter]!
    quests: [Quest]!
  }
`;

module.exports = dungeonTypeDefs;