<template>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4 p-4">
        <CRow>
          <h2>Excursões</h2>
        </CRow>
        <CRow>
          <h6>Filtros</h6>
          <AdressForm :isBoarding="true" @change-address="changeAddressFilter" />
        </CRow>
        <CRow class="mt-4 mb-4">
          <CCol>
            <CFormLabel>Embarque a partir de</CFormLabel>
            <CFormInput v-model="filter.dateInit" id="exampleFormControlInput1" type="datetime-local" />
          </CCol>
          <CCol>
            <CFormLabel>Embarque até</CFormLabel>
            <CFormInput v-model="filter.dateEnd" id="exampleFormControlInput1" type="datetime-local" />
          </CCol>
        </CRow>
        <CRow>
          <CCol class="align-self-end" xs="12">
            <CButton color="primary" @click="search">Buscar</CButton>
          </CCol>
        </CRow>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Nome</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">País</CTableHeaderCell>
                <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                <CTableHeaderCell scope="col">Cidade</CTableHeaderCell>
                <CTableHeaderCell scope="col">Embarque</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ações</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody v-for="tourData in tour" :key="tourData.id">
              <CTableRow :color="getStatusColor(tourData.status)">
                <CTableHeaderCell scope="row">{{ tourData.name }}</CTableHeaderCell>
                <CTableDataCell>{{ getStatusName(tourData.status) }}</CTableDataCell>
                <CTableDataCell>{{ tourData.destiny.country.name_pt }}</CTableDataCell>
                <CTableDataCell>{{ tourData.destiny.state.name }}</CTableDataCell>
                <CTableDataCell>{{ tourData.destiny.city.name }}</CTableDataCell>
                <CTableDataCell>{{ tourData.boarding_date ? new Date(tourData.boarding_date).toLocaleString() :
                    "Nenhum"
                }}</CTableDataCell>
                <CTableDataCell> Visualizar
                </CTableDataCell>

              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>


<script>
import { GET_TOUR } from '../../../../graphql/queries/tour/getTour.js'
import AdressForm from '../../../forms/address/Address.vue'

export default {
  name: 'TourList',
  components: { AdressForm },
  data: function () {
    return {
      tour: [],
      where: {},
      filter: {
        address: {},
        dateInit: null,
        dateEnd: null
      }
    }
  },
  apollo: {
    tour: {
      query: GET_TOUR,
      variables: {
        where: {}
      }
    }
  },
  methods: {
    search() {
      const where = {}

      const addressFilter = this.filter.address
      const dateInit = this.filter.dateInit
      const dateEnd = this.filter.dateEnd

      if (addressFilter) {
        const destiny = {}

        if (addressFilter.country && addressFilter.country.id) {
          destiny.country_id = { _eq: addressFilter.country.id }
        }

        if (addressFilter.state && addressFilter.state.id) {
          destiny.state_id = { _eq: addressFilter.state.id }
        }

        if (addressFilter.city && addressFilter.city.id) {
          destiny.city_id = { _eq: addressFilter.city.id }
        }

        where.destiny = destiny
      }

      if (dateInit) {
        const isoDate = new Date(dateInit).toISOString()

        if (!where.boarding_date) {
          where.boarding_date = {}
        }

        where.boarding_date._gte = isoDate
      }

      if (dateEnd) {
        const isoDate = new Date(dateEnd).toISOString()

        if (!where.boarding_date) {
          where.boarding_date = {}
        }

        where.boarding_date._lte = isoDate
      }

      this.$apollo.queries.tour.refetch({
        where
      })
    },
    changeAddressFilter(data) {
      this.filter.address = data
    },
    getStatusColor(name) {
      const statusMap = {
        "created": "light",
        "finalized": "danger",
        "in_progress": "success"
      }
      return statusMap[name]
    },
    getStatusName(name) {
      const statusMap = {
        "created": "Aguardando Embarque",
        "finalized": "Finalizada",
        "in_progress": "Em Andamento"
      }
      return statusMap[name]
    }
  }
  //   mixins: [Auth],
  // components: {
  // 	NewTourForm,
  // },
  // mounted () {
  // 	cep("29060290").then( value => {
  // 		console.log(value)
  // 	})
  // }
  //   data: function () {
  //     return {
  //       registred: false
  //     }
  //   },
  //   methods: {
  //     submit: async function (submitData) {
  //       try {
  //         await this.signUp(submitData)  
  //       } catch (e) {
  //         this.liveExampleVisible = true
  //         this.errorMessage = e.message
  //       }
  //     }
  //   }
}
</script>
