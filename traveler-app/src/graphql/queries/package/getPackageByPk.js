import { gql } from '@apollo/client/core'

export const PACKAGE_BY_PK = gql`
  query package($id:  uuid!) {
    packageData: package_by_pk(id: $id) {
    id
    name
    description
    is_available
    start_selling_date
    available_quantity
    price
    allowed_people
    
    package_items {
      id
      item {
        id
        name
      }
    }
    tour {
      id
      name
      description
      boardings {
        id
        name
        address {
          id
          country {
            id
            name
          }
          city {
            id
            name
          }
          state {
            id
            name
          }
          neighborhood
          street
          zip_code
          reference
        }
      }
      destiny {
        id
        country {
          id
          name_pt
        }
        city {
          id
          name
        }
        state {
          id
          name
        }
      }
    }
  }
  }
`
