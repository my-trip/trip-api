import { gql } from '@apollo/client/core'

export const INIT_MEDIA = gql`
 mutation init_media(
    $mimetype: String!
    $type: String!
 ) {
  init_media(input: {
     mimetype: $mimetype,
     type: $type
  }) {
     id
     signed_url
  }
}
`