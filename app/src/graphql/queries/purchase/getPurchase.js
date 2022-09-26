import { gql } from '@apollo/client/core'

export const GET_PURCHASE_BY_TOUR_ID = gql`
	query purchase($where: purchase_bool_exp){
		purchase(where: $where) {
			id
			price
			status
			created_at
			observation
			person {
				id
				name
				user {
					id
					email
				}
			}
			package_access {
				id
				package {
					id
					name
					quantity
				}
				travelers {
					id
					person {
						id
						name
						document
						document_type
						phone
					}
				}
			}
		}
	}
`