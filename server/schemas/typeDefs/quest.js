const { gql } = require('graphql-tag');

const questTypeDefs = gql`
  type Quest {
    id: ID!
    title: String!
    details: String!
    rewards: String!
  }
`;

module.exports = questTypeDefs;