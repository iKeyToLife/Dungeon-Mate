const { gql } = require('graphql-tag');

const classTypeDefs = gql`
  type Class {
    className: String!
    level: Int!
  }
`;

module.exports = classTypeDefs;