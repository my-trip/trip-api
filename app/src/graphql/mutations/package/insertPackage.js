import { gql } from '@apollo/client/core'

export const NEW_PACKAGE = gql`
 mutation insert_package_one(
    $name: String!
    $description: String
    $tour_id: uuid!
    $allowed_people: Int
    $quantity: Int
    $start_selling_date: timestamptz
    $close_selling_date: timestamptz
    $price: Int!
    $items:  [package_item_insert_input!]!
    $is_available: Boolean
 ) {
    insert_package_one(object: {
      name: $name,
      description:  $description,
      tour_id: $tour_id,
      allowed_people:  $allowed_people,
      quantity:  $quantity,
      start_selling_date: $start_selling_date,
      close_selling_date:  $close_selling_date,
      price: $price,
      is_available: $is_available,
      package_items: {
        data:  $items
        on_conflict: {
          constraint: package_item_package_id_item_id_key,
          update_columns:updated_at
        }
      }
    }){
      id
    }
}
`