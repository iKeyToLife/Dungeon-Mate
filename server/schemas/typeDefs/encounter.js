const { gql } = require('graphql-tag');

const encounterTypeDefs = gql`
  type Encounter {
    _id: ID!
    title: String!
    details: String!
  }
`;

module.exports = encounterTypeDefs;