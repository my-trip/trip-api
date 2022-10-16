
import { gql } from '@apollo/client/core'

export const GET_TOUR = gql`
  query tour(
    $start_date: timestamptz,
    $end_date: timestamptz,
    $allowed_people: Int,
    $destiny: jsonb
    $boarding: jsonb
   ) {
    availabled_tours(input: {
      start_date: $start_date,
      end_date:  $end_date,
      allowed_people: $allowed_people,
      destiny: $destiny
      boarding: $boarding
    }) {
      tours
    }
  }  
`