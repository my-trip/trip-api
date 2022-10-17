

import { gql } from '@apollo/client/core'

export const GET_PURCHASE_BY_PK = gql`
  query purchase($id: uuid!){
    purchase: purchase_by_pk(id: $id) {
      id
      observation
      status
      price
      person {
        name
        phone
        document
        user {
          email
        }
      }
      package_access {
        id
        travelers {
          id
          person {
            id
            name
            phone
            document
          }
        }
        package {
          name
          package_items {
            id
            item {
              id
              name
            }
          }
        }
      }
    }
  }
`