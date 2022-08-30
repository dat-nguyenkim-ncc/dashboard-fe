import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { Box } from 'theme-ui'
import {
  GET_COMPANY_PRODUCTS,
  GET_COMPANY_PRODUCTS_CLUSTER,
} from '../../../../pages/CompanyForm/graphql'
import { CompanyPeople, IPagination } from '../../../../types'
import Pagination from '../../../Pagination'
import { Paragraph } from '../../../primitives'
import { ProductList } from '../../../ProductList'
import Updating from '../../../Updating'
import ProductCluster from './ProductCluster'

type Props = {
  data: CompanyPeople
}

export default function CompanyDetailProducts(props: Props) {
  const [pagination, setPagination] = React.useState<IPagination>({
    page: 1,
    pageSize: 10,
  })
  const [filterProductNames, setFilterProductNames] = useState<string[]>([])

  const { data: dataProduct, loading: loadingProduct, refetch } = useQuery(GET_COMPANY_PRODUCTS, {
    skip: !props.data?.companyId,
    variables: {
      companyId: props.data.companyId,
      pageSize: pagination.pageSize,
      page: pagination.page,
    },
    notifyOnNetworkStatusChange: true,
  })

  const { data: dataProductCluster, loading: loadingProductCluster } = useQuery(
    GET_COMPANY_PRODUCTS_CLUSTER,
    {
      skip: !props.data?.companyId,
      variables: {
        companyId: props.data.companyId,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const gotoPage = (p: IPagination) => {
    const newPagination = { ...p, page: p.page < 1 ? 1 : p.page }
    setPagination(newPagination)

    if (!props.data.companyId) {
      refetch({
        companyId: props.data.companyId,
        page: p.page,
        pageSize: p.pageSize,
      })
    }
  }

  if (loadingProduct && loadingProductCluster) return <Updating loading />

  return (
    <Box mt={6}>
      {!!dataProductCluster?.getCompanyProductClusters?.data?.length && (
        <ProductCluster
          filterProductNames={filterProductNames}
          setFilterProductNames={setFilterProductNames}
          data={dataProductCluster?.getCompanyProductClusters?.data || []}
          productClusters={dataProductCluster?.getCompanyProducts?.productClusters || []}
        />
      )}
      {loadingProduct ? (
        <Updating loading />
      ) : !!dataProduct?.getCompanyProducts?.data?.length ? (
        <Box>
          <ProductList
            data={dataProduct?.getCompanyProducts?.data || []}
            productClusters={dataProduct?.getCompanyProducts?.productClusters || []}
            filterProductNames={filterProductNames}
          />
          <Pagination
            sx={{ justifyContent: 'center' }}
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            totalPages={Math.ceil(dataProduct.getCompanyProducts.total / pagination.pageSize)}
            changePage={page => {
              gotoPage({ ...pagination, page })
            }}
            changePageSize={pageSize => {
              gotoPage({ page: 1, pageSize })
            }}
          />
        </Box>
      ) : (
        <Paragraph sx={{ textAlign: 'center', p: 20, my: 30 }}>NO DATA AVAILABLE</Paragraph>
      )}
    </Box>
  )
}
