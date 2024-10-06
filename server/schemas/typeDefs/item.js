const { gql } = require('graphql-tag');

const itemTypeDefs = gql`
  type Item {
    name: String!
    type: String!
    description: String!
  }
`;

module.exports = itemTypeDefs;