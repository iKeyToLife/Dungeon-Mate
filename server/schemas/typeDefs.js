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
    addDungeon(title: String!, description: String): Dungeon
    updateDungeon(dungeonId: ID!, title: String, description: String): Dungeon
    deleteDungeon(dungeonId: ID!): Dungeon
    addEncounterToDungeon(dungeonId: ID!, encounterId: ID!): Dungeon  # Add 1 encounter
    removeEncounterFromDungeon(dungeonId: ID!, encounterId: ID!): Dungeon # Delete 1 encounter
    addQuestToDungeon(dungeonId: ID!, questId: ID!): Dungeon
    removeQuestFromDungeon(dungeonId: ID!, questId: ID!): Dungeon
    addCampaign(
      title: String!,
      description: String,
      npcs: [NpcInput],
      notes: [NoteInput],
      creatures: [CreatureInput],
      quests: [ID!],
      encounters: [ID!],
      dungeons: [ID!],
    ): Campaign
    updateCampaign(
      campaignId: ID!,
      title: String!,
      description: String,
      npcs: [NpcInput],
      notes: [NoteInput],
      creatures: [CreatureInput],
      quests: [ID!],
      encounters: [ID!],
      dungeons: [ID!],
    ): Campaign
    deleteCampaign(campaignId: ID!): Campaign
    addEncounterToCampaign(campaignId: ID!, encounterId: ID!): Campaign # Add 1 encounter
    removeEncounterFromCampaign(campaignId: ID!, encounterId: ID!): Campaign # Delete 1 encounter
    addQuestToCampaign(campaignId: ID!, questId: ID!): Campaign
    removeQuestFromCampaign(campaignId: ID!, questId: ID!): Campaign
    addDungeonToCampaign(campaignId: ID!, dungeonId: ID!): Campaign
    removeDungeonFromCampaign(campaignId: ID!, dungeonId: ID!): Campaign
  }
`;

module.exports = typeDefs;