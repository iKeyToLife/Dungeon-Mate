const { gql } = require('graphql-tag');

const userTypeDefs = gql`
  type Profile {
    firstName: String
    lastName: String
    avatar: String
    bio: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type User {
    _id: ID
    username: String!
    email: String!
    role: [String]
    profile: Profile
  }

  input ProfileInput {
    firstName: String
    lastName: String
    avatar: String
    bio: String
  }
`;

module.exports = userTypeDefs;