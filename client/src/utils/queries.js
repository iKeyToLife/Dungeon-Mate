import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Users {
    users {
      username
  }
}`;

export const GET_ENCOUNTERS = gql`
  query getAllEncounters {
  encounters {
    _id
    title
    details
  }
}
`

export const GET_ENCOUNTER = gql`
  query getEncounterById($encounterId: ID!) {
    encounter(encounterId: $encounterId) {
      _id
      title
      details
    }
  }
`;

export const GET_CHARACTERS_BY_USER_ID = gql`
  query GetCharactersByUserId {
    characters {
      _id
      name
      race
      gender
      class {
        className
        level
      }
      attributes {
        strength
        dexterity
        constitution
        intelligence
        wisdom
        charisma
        hitPoints
        armorClass
        attackPower
        magicPower
      }
      bio
      proficiencies
      inventory {
        index
        name
        type
      }
      spells {
        index
        name
      }
      alignment
      characterImg
    }
}`

export const GET_CHARACTER_BY_ID = gql`
  query GetCharacterById($characterId: ID!) {
    character(characterId: $characterId) {
      _id
      name
      race
      gender
      class {
        className
        level
      }
      attributes {
        strength
        dexterity
        constitution
        intelligence
        wisdom
        charisma
        hitPoints
        armorClass
        attackPower
        magicPower
      }
      proficiencies
      inventory {
        index
        name
        type
      }
      spells {
        index
        name
      }
      alignment
      characterImg
      bio
    }
  }
`;

export const GET_QUESTS = gql`
  query getAllQuests {
    quests {
      _id
      title
      details
      rewards
    }
  }
`;

export const GET_QUEST = gql`
  query getQuestById($questId: ID!) {
    quest(questId: $questId) {
      _id
      title
      details
      rewards
    }
  }
`;

export const GET_DUNGEONS = gql`
  query getAllDungeons {
    dungeons {
      _id
      title
      description
      encounters {
        _id
        title
        details
      }
      quests {
        _id
        title
        details
        rewards
      }
    }
  }
`;

export const GET_DUNGEON = gql`
  query getDungeonById($dungeonId: ID!) {
    dungeon(dungeonId: $dungeonId) {
      _id
      title
      description
      encounters {
        _id
        title
        details
      }
      quests {
        _id
        title
        details
        rewards
      }
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query getAllCampaigns {
    campaigns {
      _id
      title
      description
      npcs   
      notes   
      creatures {
        index
        name
      }
      encounters {
        _id
        title
      }
      quests {
        _id
        title
      }
      dungeons {
        _id
        title
      }
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query getCampaignById($campaignId: ID!) {
    campaign(campaignId: $campaignId) {
      _id
      title
      description
      npcs    
      notes   
      creatures {
        index
        name
      }
      encounters {
        _id
        title
        details
      }
      quests {
        _id
        title
        details
        rewards
      }
      dungeons {
        _id
        title
        description
        encounters {
          title
          details
        }
        quests {
          title
          details
          rewards
        }
      }
    }
  }
`;