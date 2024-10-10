const { gql } = require('graphql-tag');

const itemTypeDefs = gql`
  type Item {
    index: String!
    name: String!
    type: String!
  }

  input InventoryItemInput {
  index: String!
  name: String!
  type: String!
}
`;

module.exports = itemTypeDefs;