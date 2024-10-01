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
  level: Number
  }

  type Attributes {
  strength: Number
  dexterity: Number
  constitution: Number
  intelligence: Number
  wisdom: Number
  charisma: Number
  }

  type Character {
  _id: ID
  name: String!
  race: [String!]
  gender: String
  class: Class
  charcterImg: String
  level: Number
  attributes: Attributes

  }

  type Query {
    users: [User]
  }

`;

module.exports = typeDefs;
