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
`

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