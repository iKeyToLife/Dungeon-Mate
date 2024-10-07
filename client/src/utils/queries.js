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

export const GET_CHARACTERS_BY_USER_ID = gql`
    query GetCharactersByUserId{
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
            }
            characterImg
            alignment
        }
    }
`;