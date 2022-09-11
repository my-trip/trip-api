import { gql } from '@apollo/client/core'

export const GET_PURCHASE_BY_TOUR_ID = gql`
	query purchase($tourId: uuid!){
		purchase(where: { package_access: { package: { tour_id: { _eq: $tourId } }}  }) {
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
					confirmateds: package_accesses_aggregate(where: { purchase: {status: { _eq: "confirmated"}}}) {
          	aggregate {
            	count
          	}
        	}
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