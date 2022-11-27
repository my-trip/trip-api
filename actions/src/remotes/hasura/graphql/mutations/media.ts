import { gql } from '@apollo/client/core'

export const INSERT_MEDIA = gql`
mutation insert_media($id: uuid!, $user_id: uuid!, $type: String!, $record_id: uuid, $mimetype: String!, $signed_url: String!) {
  insert_media_one(object: {id: $id, signed_url: $signed_url, type: $type, record_id: $record_id, mimetype: $mimetype, user_id: $user_id}) {
    id
    type
    record_id
    mimetype
    signed_url
  }
}
`
