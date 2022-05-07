import { gql } from '@apollo/client/core'

export const INSERT_USER = gql`
  mutation insert_user_one(
    $email: String!
    $password: String!
    $role: String!
  ) {
    insert_user_one(
      object: {
        email: $email
        password: $password
        role: $role
      }
    ) {
      id
      email
      role
    }
  }
`