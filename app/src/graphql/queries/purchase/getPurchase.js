import { gql } from '@apollo/client/core'

export const GET_PURCHASE_BY_TOUR_ID = gql`
	query purchase($tourId: uuid!){
		purchase(where: { package: { tour_id: { _eq: $tourId } }}) {
			id
			price
			status
			created_at
			package {
				id
				name
			}
			person {
				id
				name
				user {
					id
					email
				}
			}
			package_accesses {
				id
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