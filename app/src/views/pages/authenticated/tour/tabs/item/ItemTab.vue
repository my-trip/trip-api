<template>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4 p-4">
        <CCardBody>
          <!-- <CRow>
						<h6>Filtros</h6>
					</CRow>
					<AdressForm :isBoarding="true" @change-address="changeAddressFilter" /> -->
          <CTable v-if="hasItem" class="mt-5 mb-0 border" hover responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody v-for="itemData in item" :key="itemData.id">
              <CTableRow>
                <CTableDataCell class="text-center" scope="row">{{ itemData.name }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ itemData.description || "-" }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <div class="" v-else>
            <p class="text-medium-emphasis text-center">Não há itens cadastrados</p>
          </div>
        </CCardBody>

      </CCard>
    </CCol>
  </CRow>
</template>


<script>
import { GET_ITEM } from '../../../../../../graphql/queries/item/getItem.js'

export default {
  name: 'ItemTab',
  data: function () {
    return {
      item: [],
      where: {},
      filter: {
        name: null
      }
    }
  },
  apollo: {
    item: {
      query: GET_ITEM,
      variables: {
        where: {}
      }
    }
  },
  computed: {
    hasItem() {
      console.log(this.item)
      return true
    }
  },
  methods: {
    search() {
      const where = {}
    }
  }
}
</script>
