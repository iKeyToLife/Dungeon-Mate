const { gql } = require('graphql-tag');

const typeDefs = gql`

  type Profile {
    firstName: String
    lastName: String
    avatar: String
    bio: String
  }

  type Class {
    className: String!
    level: Int!
  }

  type Attributes {
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
  }

  type User {
    _id: ID
    username: String!
    email: String!
    role: [String]
    profile: Profile
  }

  type Character {
    _id: ID
    name: String!
    race: String!
    gender: String!
    level: Int!
    class: [Class]!
    characterImg: String
    attributes: Attributes!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    characters: [Character]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
  }

`;

module.exports = typeDefs;
