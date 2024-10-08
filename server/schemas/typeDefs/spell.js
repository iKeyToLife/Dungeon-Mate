const { gql } = require('graphql-tag');

const spellTypeDefs = gql`
  type Spell {
    index: String!
    name: String!
  }

  input SpellInput {
  index: String!
  name: String!
}
`;

module.exports = spellTypeDefs;