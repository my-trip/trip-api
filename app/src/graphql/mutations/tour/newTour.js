import { gql } from '@apollo/client/core'

export const NEW_TOUR = gql`
 mutation insert_tour(
    $name: String!
    $description: String!
    $destiny_city_id: Int
    $destiny_country_id: Int!
    $destiny_state_id: Int
    $boarding_city_id: Int
    $boarding_state_id: Int
    $boarding_street: String
    $boarding_reference: String
    $boarding_neighborhood: String
    $boarding_zip_code: String
    $boarding_date: timestamptz
 ) {
  insert_tour_one(object: {
    name: $name,
    description:  $description,
    destiny: {
      data: {
        city_id: $destiny_city_id,
        state_id:  $destiny_state_id,
        country_id: $destiny_country_id
      }
    }
    boardings: {
      data: {
        date: $boarding_date,
        type:"DEPEARTURE",
        address: {
          data: {
            city_id: $boarding_city_id,
            state_id: $boarding_state_id,
            country_id: 1,
            zip_code: $boarding_zip_code,
            street: $boarding_street,
            neighborhood: $boarding_neighborhood
            reference: $boarding_reference
          }
        }
      }
    }
  }){
    id
  }
}
`