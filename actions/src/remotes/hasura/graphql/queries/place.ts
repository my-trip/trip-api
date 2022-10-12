
import { gql } from '@apollo/client/core'

export const PLACE = gql`
  query($name: String!) {
    city(where: {
      name: {
        _ilike: $name
      }
    }, order_by: {id: asc}) {
      id
      name
      state {
        id
        name
      }
    }
    state(where: {name: {
      _ilike: $name
    }}, order_by: {id: asc}) {
      id
      name
    }
  }
`
