import { gql } from '@apollo/client/core'

export const GET_COUNTRY = gql`
  query country {
    country {
      id
      name_pt
    }   
  }

`