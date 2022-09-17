

import { gql } from '@apollo/client/core'

export const GET_CITY_BY_STATE_ID = gql`
	query city($stateId: Int!){
		city(where: { state_id: {_eq: $stateId}}) {
		  id
		  name
		}
	}
  `

