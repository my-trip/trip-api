import { gql } from '@apollo/client/core'

export const TOUR_BY_PK = gql`
  query tour($id:  uuid!) {
    tour: tour_by_pk(id: $id) {
      name
      status
      boarding_date
      packages {
        id
        name
        description
        allowed_people
        price
        close_selling_date
        package_items {
          id
          item {
            id
            name
          }
        }
      }
      boardings {
        id
        date
        name
        address {
          state {
            name
          }
          city {
            name
          }
        }
      }
    }
  }
`
