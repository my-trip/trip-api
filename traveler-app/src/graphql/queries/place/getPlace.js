
import { gql } from '@apollo/client/core'

export const GET_PLACE = gql`
  query places($place:  String!) {
    
    places(data: {
      place: $place
    }) {
      id
      place
      type
    }
    
  }
`