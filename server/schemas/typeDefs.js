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
    addCharacter(
      name: String!,
      race: String!,
      gender: String!,
      class: [ClassInput]!,
      level: Int!,
      characterImg: String!,
      attributes: AttributesInput!,
      spells: [SpellsInput!],
      inventory: [InventoryInput!],
      alignment: String!
    ): Character
    deleteCharacter(characterId: ID!): Character
  }

  input ClassInput {
    className: String!
    level: Int!
  }

  input AttributesInput {
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
  }

  input SpellsInput {
    index: String!
    name: String!
  }

  input InventoryInput {
    name: String!
    type: String!
    description: String!
  }

`;

module.exports = typeDefs;
