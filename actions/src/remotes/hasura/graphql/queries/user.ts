import { gql } from '@apollo/client/core'

export const USER_BY_EMAIL = gql`
  query($email: String!) {
    user(where: { email: { _eq: $email } }) {
      id
      role
      email
      password
      email
      agency_manager {
        agency {
          id
          name
        }
      }
      person {
        name
      }
    }
  }
`