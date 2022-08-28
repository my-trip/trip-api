import { gql } from '@apollo/client/core'

export const UPDATE_PACKAGE = gql`
 mutation update_package_by_pk(
    $id: uuid!
    $name: String!
    $description: String
    $allowed_people: Int
    $quantity: Int
    $start_selling_date: timestamptz
    $close_selling_date: timestamptz
    $price: Int!
		$is_available: Boolean
 ) {
    update_package_by_pk(
      pk_columns:{id: $id}
      _set: {
      	name: $name,
      	description:  $description,
      	allowed_people:  $allowed_people,
      	quantity:  $quantity,
				is_available: $is_available,
      	start_selling_date: $start_selling_date,
      	close_selling_date:  $close_selling_date,
      	price: $price,
    }){
      id
    }
}
`