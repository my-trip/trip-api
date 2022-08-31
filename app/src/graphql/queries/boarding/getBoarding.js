


import { gql } from '@apollo/client/core'

export const GET_BOARDING_BY_TOUR_ID = gql`
	query boarding($tourId: uuid!){
		boarding(where: {
      tour_id: { _eq: $tourId }
    }) {
      id
      date
      address {
        id
        city {
          id
          name
        }
        country {
          id
          name_pt
        }
        state {
          id
          name
        }
        street
        zip_code
        neighborhood
        reference
      }
    }
	}
  `
