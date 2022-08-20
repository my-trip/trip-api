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
              </CTableRow>
            </CTableHead>
            <CTableBody v-for="tourData in tour" :key="tourData.id">
              <CTableRow :color="getStatusColor(tourData.status)">
                <CTableHeaderCell scope="row">{{ tourData.name }}</CTableHeaderCell>
                <CTableDataCell>{{ getStatusName(tourData.status) }}</CTableDataCell>
                <CTableDataCell>{{ tourData.destiny.country.name }}</CTableDataCell>
                <CTableDataCell>{{ tourData.destiny.country.state }}</CTableDataCell>
                <CTableDataCell>{{ tourData.destiny.country.city }}</CTableDataCell>
                <CTableDataCell>{{ new Date(tourData.boarding_date).toLocaleString() }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>


<script>
// import AgencyRegisterForm from '@/views/forms/agency/register.vue'
// import Auth from '@/mixins/auth'
import { GET_TOUR } from '../../../../graphql/queries/tour/getTour.js'
import AdressForm from '../../../forms/address/Address.vue'

export default {
  name: 'TourList',
  components: { AdressForm },
  data: function () {
    return {
      tour: []
    }
  },
  apollo: {
    tour: {
      query: GET_TOUR
    }
  },
  methods: {
    changeAddressFilter() {
      console.log("opa")
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
