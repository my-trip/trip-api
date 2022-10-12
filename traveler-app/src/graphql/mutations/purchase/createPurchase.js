import { gql } from '@apollo/client/core'


export const CREATE_USER_PURCHASE = gql`
mutation create_user_purchase(
   $package_id: uuid!
   $travelers: [jsonb]!
){
   create_user_purchase(data: {
      package_id: $package_id,
      travelers: $travelers
  }) {
    purchase_id
  }
}
`