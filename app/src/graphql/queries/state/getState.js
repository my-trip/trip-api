


import { gql } from '@apollo/client/core'

export const GET_STATE_BY_COUNTRY_ID = gql`
  query state($countryId: Int!){
    state(where: { country_id: {_eq: $countryId} }) {
      id
      name
    }
  }
`

