<template>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4 p-4">
        <CCardBody>
          <CRow>
            <CCol :md="5">
              <CButton :color="newItemColor" @click="changeNewItemClicked">Novo Embarque</CButton>
            </CCol>
          </CRow>
          <CRow v-if="newItemClicked" class="mt-4">
            <CCol>
              <CCard class="mb-4 p-4">
                <CCardBody>
                  <div class="row">
                    <AdressForm :isBoarding="false" @change-address="changeDestinyAddress" />
                  </div>
                  <div class="row mt-4">
                    <div class="col-md-3">
                      <CFormLabel>Data</CFormLabel>
                      <CFormInput v-model="newBoarding.date" id="exampleFormControlInput1" type="datetime-local" />
                    </div>
                    <div class="col-md-3">
                      <CFormLabel>Nome</CFormLabel>
                      <CFormInput v-model="newBoarding.name" id="exampleFormControlInput1" type="text" />
                    </div>
                    <CRow class="mt-4">
                      <CCol :md="2">
                        <CButton color="light" @click="changeNewItemClicked">Cancelar</CButton>
                      </CCol>
                      <CCol :md="2">
                        <CButton color="primary" @click="createBoarding" type="submit">Cadastrar</CButton>
                      </CCol>
                    </CRow>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CToaster placement="top-end">
            <CToast :key="toast.title" v-for="(toast) in toasts">
              <CToastHeader closeButton>
                <span class="me-auto fw-bold">{{ toast.title }}</span>
                <small>7 min ago</small>
              </CToastHeader>
              <CToastBody>
                {{ toast.content }}
              </CToastBody>
            </CToast>
          </CToaster>
          <CTable v-if="hasBoarding" class="mt-3 mb-0 border" hover responsive>
            <CTableHead color="primary">
              <CTableRow>
                <CTableHeaderCell class="text-center" scope="col">Data</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Estado</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Cidade</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Bairro</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Rua</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">CEP</CTableHeaderCell>
                <CTableHeaderCell class="text-center" scope="col">Referência</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody v-for="boardingData in boarding" :key="boardingData.id">
              <CTableRow>
                <CTableDataCell class="text-center" scope="row">{{ getBoardingDate(boardingData.date) }}
                </CTableDataCell>
                <CTableDataCell class="text-center">{{ boardingData.name ? boardingData.name :
                "-"
                }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ boardingData.address.state ? boardingData.address.state.name :
                "-"
                }}</CTableDataCell>
                <CTableDataCell class="text-center" scope="row">{{ boardingData.address.city
                ? boardingData.address.city.name : "-"
                }}</CTableDataCell>
                <CTableDataCell class="text-center" scope="row">{{ boardingData.address.neighborhood || "-" }}
                </CTableDataCell>
                <CTableDataCell class="text-center" scope="row">{{ boardingData.address.street || "-" }}
                </CTableDataCell>
                <CTableDataCell class="text-center" scope="row">{{ boardingData.address.zip_code || "-" }}
                </CTableDataCell>
                <CTableDataCell class="text-center" scope="row">{{ boardingData.address.reference || "-" }}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <div class="pt-5" v-else>
            <p class="text-medium-emphasis text-center">Não há embarques cadastrados</p>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>


<script>
import { GET_BOARDING_BY_TOUR_ID } from '../../../../../../graphql/queries/boarding/getBoarding.js'
import { NEW_BOARDING } from '../../../../../../graphql/mutations/boarding/insertBoarding.js'
import AdressForm from '../../../../../forms/address/Address.vue'

export default {
  name: 'ItemTab',
  components: {
    AdressForm
  },
  data: function () {
    return {
      boarding: [],
      where: {},
      newItemClicked: false,
      newBoarding: {
        date: null,
        name: null,
        address: null
      },
      filter: {
        name: null
      },
      validatedCustom01: null,
      toasts: []
    }
  },
  apollo: {
    boarding: {
      query: GET_BOARDING_BY_TOUR_ID,
      variables() {
        return {
          tourId: this.$route.params.id
        }
      }
    }
  },
  computed: {
    newItemColor() {
      return this.newItemClicked ? "light" : "primary"
    },
    hasBoarding() {
      return this.boarding && this.boarding.length > 0
    }
  },
  methods: {
    changeDestinyAddress: function (event) {
      this.newBoarding.address = event
    },
    getBoardingDate(date) {
      if (date) {
        const newDate = new Date(date)
        return newDate.toLocaleString()
      }
      return "Não Definido"
    },
    createToast() {
      this.toasts.push({
        title: 'Sucesso!',
        content: 'Um novo embarque foi cadastrado!'
      })
    },
    changeNewItemClicked() {
      this.newItemClicked = !this.newItemClicked
    },
    createBoarding() {
      const isoDate = new Date(this.newBoarding.date).toISOString()
      const tourId = this.$route.params.id
      const boardingAddress = this.newBoarding.address

      const variables = {
        name: this.newBoarding.name,
        city_id: boardingAddress.city.id,
        state_id: boardingAddress.state.id,
        street: boardingAddress.street,
        reference: boardingAddress.reference,
        neighborhood: boardingAddress.neighborhood,
        zip_code: boardingAddress.zipCode,
        date: isoDate,
        tourId
      }

      this.$apollo.mutate({
        mutation: NEW_BOARDING,
        variables
      }).then(value => {
        this.createToast()
        this.changeNewItemClicked()
        this.$apollo.queries.boarding.refetch()

        this.newBoarding = {
          date: null,
          name: null,
          address: null
        }
      }).catch(err => {
        console.log("DEU RUIN")
        console.log(err)
      })
    }
  }
}
</script>
