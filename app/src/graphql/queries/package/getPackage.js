
import { gql } from '@apollo/client/core'

export const GET_PACKAGE = gql`
  query package($where:  package_bool_exp) {
    packages: package( where: $where ){
      id
      name
      description
      allowed_people
      quantity
      start_selling_date
      close_selling_date
			price
      is_available
			package_items {
      	id
       	item {
        	id
        	name
        	description
      	}
    	}
		}
  }
`


