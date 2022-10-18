

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

export const FINISH_MEDIA = gql`
mutation ($media_id: uuid!, $public_url: String!, $filesize: Int!) {
  media: update_media_by_pk(pk_columns: {id: $media_id}, _set: {public_url: $public_url, filesize: $filesize}) {
    id
    user_id
    record_id
    type
    mimetype
    filesize
    public_url
    updated_at
    created_at
  }
}`