


import { gql } from '@apollo/client/core'

export const NEW_BOARDING = gql`
 mutation insert_item_one(
    $date: timestamptz!,
    $tourId: uuid!,
    $cityId: Int,
    $countryId: Int,
    $stateId: Int,
    $zipCode: String,
    $neighborhood: String,
    $reference: String,
    $street: String
 ) {
  insert_boarding_one(object: {
    date: $date,
    tour_id: $tourId,
    type: "DEPEARTURE",
    address: {
      data: {
        city_id: $cityId,
        country_id: 1,
        state_id: $stateId,
        street: $street,
        neighborhood: $neighborhood,
        zip_code: $zipCode,
        reference: $reference
      }
    }
  }) {
    id
  }
}
`