import { gql } from '@apollo/client/core'

export const MEDIA = gql`
query($id: uuid!) {
  media_by_pk(id: $id) {
    id
    type
    record_id
    user {
      id
    }
    mimetype
    signed_url
    public_url
    filesize
  }
}
`