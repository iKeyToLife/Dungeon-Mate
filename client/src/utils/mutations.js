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