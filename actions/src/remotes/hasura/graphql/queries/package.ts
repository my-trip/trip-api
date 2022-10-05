import { gql } from '@apollo/client/core'

export const PACKAGE_BY_ID = gql`
  query($id: uuid!) {
      package_by_pk(id: $id) {
        id
        allowed_people
        payment_limit_day
        is_available
      }
    }
  }
`