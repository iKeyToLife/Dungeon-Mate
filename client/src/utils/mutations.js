import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation signUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_ENCOUNTER = gql`
  mutation addEncounter($title: String!, $details: String!) {
   addEncounter(title: $title, details: $details) {
      _id
      title
     details
  }
}`

export const DELETE_ENCOUNTER = gql`
mutation DeleteEncounter($encounterId: ID!) {
   deleteEncounter(encounterId: $encounterId) {
     _id
      title
      details
  }
}`

export const UPDATE_ENCOUNTER = gql`
  mutation updateEncounter($encounterId: ID!, $title: String!, $details: String!) {
  updateEncounter(encounterId: $encounterId, title: $title, details: $details) {
    _id
    title
    details
  }
}
`

export const ADD_CHARACTER = gql`
mutation AddCharacter(
  $name: String!,
  $race: String!,
  $gender: String!,
  $class: [ClassInput]!,
  $level: Int!,
  $attributes: AttributesInput!,
  $spells: [SpellsInput!],
  $inventory: [InventoryInput!]
  $characterImg: String!
  $alignment: String!
) {
  addCharacter(
    name: $name,
    race: $race,
    gender: $gender,
    class: $class,
    level: $level,
    attributes: $attributes,
    spells: $spells,
    inventory: $inventory,
    characterImg: $characterImg,
    alignment: $alignment
  ) {
    _id
  }
}`

export const UPDATE_CHARACTER = gql`
mutation UpdateCharacter($characterId: ID!, $name: String, $race: String, $gender: String, $class: [ClassInput], $alignment: String, $level: Int, $characterImg: String) {
  updateCharacter(characterId: $characterId, name: $name, race: $race, gender: $gender, class: $class, alignment: $alignment, level: $level, characterImg: $characterImg) {
    race
    name
    level
    gender
    class {
      className
      level
    }
    characterImg
    attributes {
      charisma
      constitution
      dexterity
      intelligence
      strength
      wisdom
    }
    alignment
    _id
  }
}`

export const DELETE_CHARACTER = gql`
mutation DeleteCharacter($characterId: ID!) {
   deleteCharacter(characterId: $characterId) {
     _id
  }
}`

export const ADD_QUEST = gql`
  mutation addQuest($title: String!, $details: String!, $rewards: String!) {
    addQuest(title: $title, details: $details, rewards: $rewards) {
      _id
      title
      details
      rewards
    }
  }
`;

export const DELETE_QUEST = gql`
  mutation DeleteQuest($questId: ID!) {
    deleteQuest(questId: $questId) {
      _id
      title
      details
      rewards
    }
  }
`;

export const UPDATE_QUEST = gql`
  mutation updateQuest($questId: ID!, $title: String!, $details: String!, $rewards: String!) {
    updateQuest(questId: $questId, title: $title, details: $details, rewards: $rewards) {
      _id
      title
      details
      rewards
    }
  }
`;

export const ADD_DUNGEON = gql`
  mutation addDungeon($title: String!, $description: String!) {
    addDungeon(title: $title, description: $description) {
      _id
      title
      description
    }
  }
`;

export const DELETE_DUNGEON = gql`
  mutation deleteDungeon($dungeonId: ID!) {
    deleteDungeon(dungeonId: $dungeonId) {
      _id
      title
    }
  }
`;

export const UPDATE_DUNGEON = gql`
  mutation updateDungeon($dungeonId: ID!, $title: String!, $description: String!) {
    updateDungeon(dungeonId: $dungeonId, title: $title, description: $description) {
      _id
      title
      description
    }
  }
`;

export const ADD_ENCOUNTER_TO_DUNGEON = gql`
  mutation addEncounterToDungeon($dungeonId: ID!, $encounterId: ID!) {
    addEncounterToDungeon(dungeonId: $dungeonId, encounterId: $encounterId) {
      _id
      title
      encounters {
        _id
        title
      }
    }
  }
`;

export const ADD_QUEST_TO_DUNGEON = gql`
  mutation addQuestToDungeon($dungeonId: ID!, $questId: ID!) {
    addQuestToDungeon(dungeonId: $dungeonId, questId: $questId) {
      _id
      title
      quests {
        _id
        title
      }
    }
  }
`;

export const REMOVE_ENCOUNTER_FROM_DUNGEON = gql`
  mutation RemoveEncounterFromDungeon($dungeonId: ID!, $encounterId: ID!) {
    removeEncounterFromDungeon(dungeonId: $dungeonId, encounterId: $encounterId) {
      _id
      title
      description
      encounters {
        _id
        title
      }
      quests {
        _id
        title
      }
    }
  }
`;

export const REMOVE_QUEST_FROM_DUNGEON = gql`
  mutation RemoveQuestFromDungeon($dungeonId: ID!, $questId: ID!) {
    removeQuestFromDungeon(dungeonId: $dungeonId, questId: $questId) {
      _id
      title
      description
      encounters {
        _id
        title
      }
      quests {
        _id
        title
      }
    }
  }
`;

export const ADD_CAMPAIGN = gql`
  mutation addCampaign(
    $title: String!,
    $description: String,
    $npcs: String,    
    $notes: String,    
    $encounters: [ID!],
    $quests: [ID!],
    $dungeons: [ID!],
    $creatures: [CreatureInput!]
  ) {
    addCampaign(
      title: $title,
      description: $description,
      npcs: $npcs,        
      notes: $notes,       
      encounters: $encounters,
      quests: $quests,
      dungeons: $dungeons,
      creatures: $creatures
    ) {
      _id
      title
      description
      npcs   
      notes   
      creatures {
        index
        name
      }
    }
  }
`;


export const DELETE_CAMPAIGN = gql`
  mutation deleteCampaign($campaignId: ID!) {
    deleteCampaign(campaignId: $campaignId) {
      _id
      title
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation updateCampaign(
    $campaignId: ID!,
    $title: String!,
    $description: String,
    $npcs: String,     
    $notes: String,    
    $encounters: [ID!],  
    $creatures: [CreatureInput],      
    $quests: [ID!],             
    $dungeons: [ID!]   
  ) {
    updateCampaign(
      campaignId: $campaignId,
      title: $title,
      description: $description,
      npcs: $npcs,       
      notes: $notes,     
      encounters: $encounters,
      creatures: $creatures,
      quests: $quests,
      dungeons: $dungeons        
    ) {
      _id
      title
      description
      npcs   
      notes   
    }
  }
`;

export const ADD_ENCOUNTER_TO_CAMPAIGN = gql`
  mutation addEncounterToCampaign($campaignId: ID!, $encounterId: ID!) {
    addEncounterToCampaign(campaignId: $campaignId, encounterId: $encounterId) {
      _id
      title
      encounters {
        _id
        title
      }
    }
  }
`;

export const ADD_QUEST_TO_CAMPAIGN = gql`
  mutation addQuestToCampaign($campaignId: ID!, $questId: ID!) {
    addQuestToCampaign(campaignId: $campaignId, questId: $questId) {
      _id
      title
      quests {
        _id
        title
      }
    }
  }
`;

export const ADD_DUNGEON_TO_CAMPAIGN = gql`
  mutation addDungeonToCampaign($campaignId: ID!, $dungeonId: ID!) {
    addDungeonToCampaign(campaignId: $campaignId, dungeonId: $dungeonId) {
      _id
      title
      dungeons {
        _id
        title
      }
    }
  }
`;

export const REMOVE_ENCOUNTER_FROM_CAMPAIGN = gql`
  mutation removeEncounterFromCampaign($campaignId: ID!, $encounterId: ID!) {
    removeEncounterFromCampaign(campaignId: $campaignId, encounterId: $encounterId) {
      _id
      title
      encounters {
        _id
        title
      }
    }
  }
`;

export const REMOVE_QUEST_FROM_CAMPAIGN = gql`
  mutation removeQuestFromCampaign($campaignId: ID!, $questId: ID!) {
    removeQuestFromCampaign(campaignId: $campaignId, questId: $questId) {
      _id
      title
      quests {
        _id
        title
      }
    }
  }
`;

export const REMOVE_DUNGEON_FROM_CAMPAIGN = gql`
  mutation removeDungeonFromCampaign($campaignId: ID!, $dungeonId: ID!) {
    removeDungeonFromCampaign(campaignId: $campaignId, dungeonId: $dungeonId) {
      _id
      title
      dungeons {
        _id
        title
      }
    }
  }
`;

export const ADD_CREATURE_TO_CAMPAIGN = gql`
  mutation addCreatureToCampaign($campaignId: ID!, $creatureId: ID!) {
    addCreatureToCampaign(campaignId: $campaignId, creatureId: $creatureId) {
      _id
      title
      creatures {
        _id
        name
      }
    }
  }
`;

export const DELETE_CREATURE_FROM_CAMPAIGN = gql`
  mutation deleteCreatureFromCampaign($campaignId: ID!, $creatureId: ID!) {
    deleteCreatureFromCampaign(campaignId: $campaignId, creatureId: $creatureId) {
      _id
      title
      creatures {
        _id
        name
      }
    }
  }
`;