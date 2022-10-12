import { gql } from '@apollo/client/core'

export const UPDATE_PURCHASE = gql`
 mutation update_purchase_by_pk(
    $id: uuid!
    $status: String!
    $observation: String!
 ) {
    update_purchase_by_pk(pk_columns: {id: $id}, _set: {
    status: $status,
    observation: $observation
  }
  ){
      id
    }
}
`
