import { gql } from '@apollo/client/core'

export const INSERT_PERSON = gql`
  mutation insert_person_one(
    $name: String!
    $document: String!
    $document_type: document_type_enum!
    $birth: timestamptz
  ) {
    insert_person_one(
      object: {
        name: $name
        document: $document
        document_type: $document_type
        birth: $birth
      }
    ) {
      id
      name
      document
      document_type
      birth
    }
  }
`
