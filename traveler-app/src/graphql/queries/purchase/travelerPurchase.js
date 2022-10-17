import { gql } from '@apollo/client/core'

export const GET_TRAVELER_PURCHASE = gql`
	query purchase{
		purchase {
  	  id
  	  status
  	  price
  	  package_access {
  	    package  {
  	      id
          name
  	      tour {
  	        name
  	      }
  	      package_items {
  	        item {
  	          name
  	        }
  	      }
  	    }
  	    travelers {
  	      id
  	      person {
  	        id
  	        name
  	        document
  	        phone
  	      }
  	      boarding {
  	        id
  	        date
  	        name
  	      }
  	    }
  	  }
  	}
	}
`