
import { gql } from '@apollo/client/core'

export const GET_ITEM = gql`
  query item($where:  item_bool_exp) {
    item( where: $where ){
      id
      name
      description
    }
  }
`


