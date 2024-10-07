const { gql } = require('graphql-tag');
const userTypeDefs = require('./typeDefs/user');
const characterTypeDefs = require('./typeDefs/character');
const encounterTypeDefs = require('./typeDefs/encounter');
const classTypeDefs = require('./typeDefs/class');
const itemTypeDefs = require('./typeDefs/item');
const spellTypeDefs = require('./typeDefs/spell');
const questTypeDefs = require('./typeDefs/quest');
const dungeonTypeDefs = require('./typeDefs/dungeon');

const typeDefs = gql`
  ${userTypeDefs}
  ${characterTypeDefs}
  ${encounterTypeDefs}
  ${classTypeDefs}
  ${itemTypeDefs}
  ${spellTypeDefs}
  ${questTypeDefs}
  ${dungeonTypeDefs}

  type Query {
    users: [User]
    user: User
    characters: [Character]
    character(characterId: ID!): Character
    encounters: [Encounter]
    encounter(encounterId: ID!): Encounter
    quests: [Quest]
    quest(questId: ID!): Quest
    dungeons: [Dungeon]
    dungeon(dungeonId: ID!): Dungeon
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
    addEncounterToDungeon(dungeonId: ID!, encounterId: ID!): Dungeon  # Add 1 encounter
    removeEncounterFromDungeon(dungeonId: ID!, encounterId: ID!): Dungeon # Delete 1 encounter
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
    addDungeon(title: String!, description: String): Dungeon
    updateDungeon(dungeonId: ID!, title: String, description: String): Dungeon
    deleteDungeon(dungeonId: ID!): Dungeon
  }
`;

module.exports = typeDefs;