import { gql } from '@apollo/client'
import { Fragments } from '.'

export default gql`
  query($companyId: Int!, $page: Int, $pageSize: Int) {
    getCompanyProducts(companyId: $companyId, page: $page, pageSize: $pageSize) {
      data {
        ...Product
      }
      productClusters
      total
    }
  }
  ${Fragments.product}
`
