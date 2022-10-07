import { gql } from '@apollo/client/core'

export const INSERT_PURCHASE = gql`
  mutation insert_purchase_one(
    $person_id: uuid!
    $price: Int!
    $package_id: uuid!
    $travelers: traveler_arr_rel_insert_input!
    $status: String!,
    $expiration_date: timestamptz!
  ) {
    purchase:insert_purchase_one(
      object: {
       status: $status,
       person_id: $person_id,
       price:  $price,
       expiration_date: $expiration_date
       package_access: {
        data:{
         package_id:  $package_id,
         travelers: $travelers
        }
      }
    }
  ) {
      id
    }
  }
`