const { gql } = require('graphql-tag');

const characterTypeDefs = gql`
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

  type Character {
    _id: ID
    name: String!
    race: String!
    gender: String!
    level: Int!
    class: [Class]!
    characterImg: String
    bio: String
    attributes: Attributes!
    alignment: String!
    spells: [Spell]
    inventory: [Item]
  }

  input ClassInput {
    className: String!
    level: Int!
  }

  input AttributesInput {
    strength: Int
    dexterity: Int
    constitution: Int
    intelligence: Int
    wisdom: Int
    charisma: Int
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

module.exports = characterTypeDefs;