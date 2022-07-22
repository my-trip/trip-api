import { gql } from '@apollo/client/core'

export const SIGNUP = gql`
  mutation LOGIN($password: String!, $email: String!) {
    login(data: { password: $password, email: $email }) {
      id
      exp
      token
    }
  }
`
