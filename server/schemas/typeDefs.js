const { gql } = require('graphql-tag');

const typeDefs = gql`

  type Profile {
  firstName: String
  lastName: String
  avatar: String
  bio: String
  }

  type User {
  _id: ID
  username: String!
  email: String!
  role: String
  profile: Profile
  }

  type Query {
    users: [User]
  }

`;

module.exports = typeDefs;
