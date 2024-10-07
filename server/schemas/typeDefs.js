const { gql } = require('graphql-tag');
const userTypeDefs = require('./typeDefs/user');
const characterTypeDefs = require('./typeDefs/character');
const encounterTypeDefs = require('./typeDefs/encounter');
const classTypeDefs = require('./typeDefs/class');
const itemTypeDefs = require('./typeDefs/item');
const spellTypeDefs = require('./typeDefs/spell');
const questTypeDefs = require('./typeDefs/quest');
const dungeonTypeDefs = require('./typeDefs/dungeon');
const campaignTypeDefs = require('./typeDefs/campaign');

const typeDefs = gql`
  ${userTypeDefs}
  ${characterTypeDefs}
  ${encounterTypeDefs}
  ${classTypeDefs}
  ${itemTypeDefs}
  ${spellTypeDefs}
  ${questTypeDefs}
  ${dungeonTypeDefs}
  ${campaignTypeDefs}

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
    campaigns: [Campaign]
    campaign(campaignId: ID!): Campaign
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
      bio: String,
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
    # Added Dungeon + Campaign here
    addDungeon(
      title: String!,
      description: String
    ): Dungeon
    deleteDungeon(dungeonId: ID!): Dungeon
    updateDungeon(dungeonId: ID!, title: String, description: String): Dungeon
    addCampaign(
      title: String!,
      description: String
    ): Campaign
    deleteCampaign(campaignId: ID!): Campaign
    updateCampaign(campaignId: ID!, title: String, description: String): Campaign

    #  James' AI-generated content mutations
    generateCharacterBackstory(characterId: ID!): String
    generateCharacterNames(characterId: ID!, numberOfNames: Int): [String]
    generateCharacterPicture(characterId: ID!, isGritty: Boolean, overwrite: Boolean): String
    generateDungeonDescription(dungeonId: ID!, theme: String, difficulty: String): String
    generateDungeonEncounter(dungeonId: ID!, encounterInput: EncounterInput!): String
    generateDungeonMap(dungeonId: ID!, mapInput: MapInput!): String
    generateDungeonPuzzles(dungeonId: ID!, puzzleInput: PuzzleInput!): String
    generateDungeonTraps(dungeonId: ID!, theme: String, difficulty: String, trapCount: Int): String
  }

  input EncounterInput {
    encounterType: String!
    difficulty: String!
    numberOfEnemies: Int!
    enemyVariety: Int!
    enemyArchetype: [String!]!
    bossEnemy: Boolean!
    bossCount: Int
  }

  input MapInput {
    theme: String!
    mapWidth: Int!
    mapHeight: Int!
    roomTypes: RoomTypesInput!
    symmetry: Boolean!
    multipleFloors: Boolean!
    difficulty: String!
  }

  input PuzzleInput {
    theme: String!
    difficulty: String!
    puzzleCount: Int!
    failureConsequence: String!
    hintAvailability: Boolean!
    reward: String!
  }
`;

module.exports = typeDefs;