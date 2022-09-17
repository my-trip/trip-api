import { gql } from '@apollo/client/core'

export const SIGIN = gql`
  mutation LOGIN($password: String!, $email: String!) {
    login(data: { password: $password, email: $email }) {
      id
      token
      name
      agency_name
      email
    }
  }
`

export const SIGNUP = gql`
  mutation SIGNUP($name: String!, $description: String!, $user: jsonb!, $person: jsonb!) {
    signup( data: { name: $name, description: $description, user: $user, person: $person}) {
      token
    }
  }
`
