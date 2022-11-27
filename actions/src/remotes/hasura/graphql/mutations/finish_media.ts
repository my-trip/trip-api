import { gql } from '@apollo/client/core'

export const FINISH_MEDIA = gql`
mutation finish_media($media_id: uuid!, $public_url: String!, $filesize: Int!) {
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