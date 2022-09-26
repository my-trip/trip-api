<template>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4 p-4">
        <CCardBody>
          <CRow>
            <h2>Excursões</h2>
          </CRow>
          <CRow>
            <h6>Filtros</h6>
          </CRow>
          <AdressForm :isBoarding="true" @change-address="changeAddressFilter" />
          <CRow class="mt-4 mb-4">
            <CCol>
              <CFormLabel>A partir de</CFormLabel>
              <CFormInput v-model="filter.dateInit" id="exampleFormControlInput1" type="datetime-local" />
            </CCol>
            <CCol>
              <CFormLabel>Até</CFormLabel>
              <CFormInput v-model="filter.dateEnd" id="exampleFormControlInput1" type="datetime-local" />
            </CCol>
          </CRow>
          <CRow class="justify-content-end">
            <CCol>
              <CButton color="primary" @click="search">Buscar</CButton>
            </CCol>
          </CRow>
          <CTable class="mt-5 mb-0 border" hover responsive>
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Destino</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Data</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody v-for="tourData in tour" :key="tourData.id">
              <CTableRow :color="getStatusColor(tourData.status)">
                <CTableDataCell class="text-center">
                  <CButton @click="() => goToTour(tourData.id)" color="primary" variant="ghost">{{ tourData.name }}</CButton>
                </CTableDataCell>
                <CTableDataCell class="text-center">{{ tourData.destiny.city.name }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ getDateString(tourData) }}</CTableDataCell>
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
    goToTour(id) {
      this.$router.push({ name: 'Tour', params: { id: id } })
    },
    getDateString(tour) {
      const initDateString = new Date(tour.start_date).toLocaleDateString()
      const endDateString = new Date(tour.end_date).toLocaleDateString()

      return `${initDateString} a ${endDateString}`
    },
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

        if (!where.start_date) {
          where.start_date = {}
        }

        where.start_date._gte = isoDate
      }

      if (dateEnd) {
        const isoDate = new Date(dateEnd).toISOString()

        if (!where.end_date) {
          where.end_date = {}
        }

        where.end_date._lte = isoDate
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
}
</script>
