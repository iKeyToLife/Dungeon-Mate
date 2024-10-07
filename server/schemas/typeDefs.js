const { gql } = require('graphql-tag');
const userTypeDefs = require('./typeDefs/user');
const characterTypeDefs = require('./typeDefs/character');
const encounterTypeDefs = require('./typeDefs/encounter');
const classTypeDefs = require('./typeDefs/class');
const itemTypeDefs = require('./typeDefs/item');
const spellTypeDefs = require('./typeDefs/spell');
const questTypeDefs = require('./typeDefs/quest');

const typeDefs = gql`
  ${userTypeDefs}
  ${characterTypeDefs}
  ${encounterTypeDefs}
  ${classTypeDefs}
  ${itemTypeDefs}
  ${spellTypeDefs}
  ${questTypeDefs}

  type Query {
    users: [User]
    user: User
    characters: [Character]
    character(characterId: ID!): Character
    encounters: [Encounter]
    encounter(encounterId: ID!): Encounter
    quests: [Quest]
    quest(questId: ID!): Quest
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    signUp(
      username: String!
      email: String!
      password: String!
      role: String
      profile: ProfileInput
    ): Auth
    updateUser(
      username: String
      email: String
      password: String
      role: String
      profile: ProfileInput
    ): User
    deleteUser: User
    addCharacter(
      name: String!,
      race: String!,
      gender: String!,
      class: [ClassInput]!,
      level: Int!,
      characterImg: String,
      attributes: AttributesInput!,
      spells: [SpellsInput!],
      inventory: [InventoryInput!],
      alignment: String!
    ): Character
    deleteCharacter(characterId: ID!): Character
    updateCharacter(
      characterId: ID!,
      name: String,
      race: String,
      gender: String,
      class: [ClassInput],
      level: Int,
      characterImg: String,
      attributes: AttributesInput,
      spells: [SpellsInput],
      inventory: [InventoryInput],
      alignment: String
      ): Character
    addSpellToCharacter(characterId: ID!, spell: SpellInput!): Character
    removeSpellFromCharacter(characterId: ID!, spellIndex: String!): Character
    addItemToInventory(characterId: ID!, item: InventoryItemInput!): Character
    removeItemFromInventory(characterId: ID!, itemName: String!): Character
    addEncounter(
      title: String!,
      details: String!
    ): Encounter
    deleteEncounter(encounterId: ID!): Encounter
    updateEncounter(encounterId: ID!, 
    title: String!, 
    details: String!): Encounter
    addQuest(
      title: String!,
      details: String!
      rewards: String!
    ): Quest
    deleteQuest(questId: ID!): Quest
    updateQuest(
      questId: ID!, 
      title: String!, 
      details: String!, 
      rewards: String!): Quest
  }
`;

module.exports = typeDefs;