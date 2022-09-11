import { gql } from '@apollo/client/core'

export const INSERT_AGENCY = gql`
    mutation insertAgency(
        $name: String!
        $description: String!
        $email: String!
        $password: String!
        # $personName: String!
        # $document: String!
        # $documentType: document_type_enum!
    ) {
      insert_agency_one(object: {
        name: $name,
        description: $description,
        agency_managers: { 
          data: {
            isAdmin: true,
          	user: {
              data: {
                email: $email,
                password: $password,
                role: "manager",
                # person: {
                #   data: {
                #     name: $personName,
                #     document: $document,
                #     document_type: $documentType
                #   } 
                # }
              }
            }
       	 	}
        }
      }) {
        id
        name
        description
        agency_managers {
          user {
            id
            role
          }
        }
      }
    }
`