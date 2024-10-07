const { gql } = require('graphql-tag');

const questTypeDefs = gql`
  type Quest {
    _id: ID!
    title: String!
    details: String!
    rewards: String!
  }
`;

module.exports = questTypeDefs;