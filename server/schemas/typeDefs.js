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
  role: [String]
  profile: Profile
  }

  type Class {
  _id: ID
  className: [String!]
  level: String
  }

  type Attributes {
  strength: String
  dexterity: String
  constitution: String
  intelligence: String
  wisdom: String
  charisma: String
  }

  type Character {
  _id: ID
  name: String!
  race: [String!]
  gender: String
  class: Class
  charcterImg: String
  level: String
  attributes: Attributes

  }

  type Query {
    users: [User]
    characters: [Character]
  }

`;

module.exports = typeDefs;
