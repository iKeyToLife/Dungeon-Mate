const { gql } = require('graphql-tag');

const itemTypeDefs = gql`
  type Item {
    name: String!
    type: String!
  }

  input InventoryItemInput {
  name: String!
  type: String!
}
`;

module.exports = itemTypeDefs;