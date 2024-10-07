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
    id
    title
    details
  }
}
`

export const GET_ENCOUNTER = gql`
  query getEncounterById($encounterId: ID!) {
  encounter(encounterId: $encounterId) {
    id
    title
    details
  }
}
`

export const GET_QUESTS = gql`
  query getAllQuests {
    quests {
      id
      title
      details
      rewards
    }
  }
`;

export const GET_QUEST = gql`
  query getQuestById($questId: ID!) {
    quest(questId: $questId) {
      id
      title
      details
      rewards
    }
  }
`;