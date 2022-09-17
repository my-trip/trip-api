


import { gql } from '@apollo/client/core'

export const NEW_ITEM = gql`
 mutation insert_item_one(
    $name: String!
    $description: String!
    $tour_id: uuid!
 ) {
    insert_item_one(object: {
    name: $name,
    description: $description,
    tour_id: $tour_id
  }) {
    id
    name
  }
}
`