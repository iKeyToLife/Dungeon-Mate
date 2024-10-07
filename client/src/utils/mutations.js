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
      id
      title
     details
  }
}`

export const DELETE_ENCOUNTER = gql`
mutation DeleteEncounter($encounterId: ID!) {
   deleteEncounter(encounterId: $encounterId) {
     id
      title
      details
  }
}`

export const UPDATE_ENCOUNTER = gql`
  mutation updateEncounter($encounterId: ID!, $title: String, $details: String) {
  updateEncounter(encounterId: $encounterId, title: $title, details: $details) {
    id
    title
    details
  }
}
`

export const ADD_QUEST = gql`
  mutation addQuest($title: String!, $details: String!, $rewards: String!) {
    addQuest(title: $title, details: $details, rewards: $rewards) {
      id
      title
      details
      rewards
    }
  }
`;

export const DELETE_QUEST = gql`
  mutation DeleteQuest($questId: ID!) {
    deleteQuest(questId: $questId) {
      id
      title
      details
      rewards
    }
  }
`;

export const UPDATE_QUEST = gql`
  mutation updateQuest($questId: ID!, $title: String!, $details: String!, $rewards: String!) {
    updateQuest(questId: $questId, title: $title, details: $details, rewards: $rewards) {
      id
      title
      details
      rewards
    }
  }
`;

export const ADD_DUNGEON = gql`
  mutation addDungeon($title: String!, $description: String!) {
    addDungeon(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const DELETE_DUNGEON = gql`
  mutation deleteDungeon($dungeonId: ID!) {
    deleteDungeon(dungeonId: $dungeonId) {
      id
      title
    }
  }
`;

export const UPDATE_DUNGEON = gql`
  mutation updateDungeon($dungeonId: ID!, $title: String!, $description: String!) {
    updateDungeon(dungeonId: $dungeonId, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const ADD_ENCOUNTER_TO_DUNGEON = gql`
  mutation addEncounterToDungeon($dungeonId: ID!, $encounterId: ID!) {
    addEncounterToDungeon(dungeonId: $dungeonId, encounterId: $encounterId) {
      id
      title
      encounters {
        id
        title
      }
    }
  }
`;

export const ADD_QUEST_TO_DUNGEON = gql`
  mutation addQuestToDungeon($dungeonId: ID!, $questId: ID!) {
    addQuestToDungeon(dungeonId: $dungeonId, questId: $questId) {
      id
      title
      quests {
        id
        title
      }
    }
  }
`;