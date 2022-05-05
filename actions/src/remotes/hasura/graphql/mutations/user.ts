import { gql } from '@apollo/client/core'

export const INSERT_USER = gql`
  mutation insert_user_one(
    $name: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    insert_user_one(
      object: {
        name: $name
        email: $email
        password: $password
        role: $role
      }
    ) {
      id
      name
      email
      role
    }
  }
`