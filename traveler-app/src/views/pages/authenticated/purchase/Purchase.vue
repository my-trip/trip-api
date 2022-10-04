<template>
  <CContainer>
    <CRow>
      <CCol>
        <CCard v-if="packageData" class="p-2">
          <CCardBody>
            <h5 class="mt-2">Cadastro de Reserva</h5>
            <h8>{{ packageData.tour.name }}:</h8>
            <div class="mt-10">
              <PackageCard :hiddenButton="true" v-if="packageData" :packageData="packageData" />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CModal scrollable alignment="center" fullscreen="lg" size="lg" @close="changeShowTravelerModal" :keyboard="false"
      :visible="showTravelerModal">
      <CModalHeader>
        <CModalTitle>Viajante</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01" @submit="updatePurchase">
          <CRow class="mt-4">
            <CCol :md="12">
              <CFormLabel>Nome</CFormLabel>
              <CFormInput v-model="traveler.name" id="exampleFormControlInput1" type="text" />
            </CCol>
          </CRow>
          <CRow class="mt-4">
            <CCol :md="12">
              <CFormLabel>CPF</CFormLabel>
              <CFormInput v-model="traveler.document" id="exampleFormControlInput1" type="text" />
            </CCol>
          </CRow>
          <CRow class="mt-4">
            <CCol :md="12">
              <CFormLabel>Telefone</CFormLabel>
              <CFormInput v-model="traveler.phone" id="exampleFormControlInput1" type="text" />
            </CCol>
          </CRow>
          <CRow>
            <CCol class="mt-4" :md="12">
              <CFormLabel>Local de Embarque</CFormLabel>
              <CFormCheck @change="changeBoardingData" v-for="boarding in packageData.tour.boardings" :key="boarding.id"
                type="radio" name="travelerBoardingRadio" :id="boarding.id" :value="boarding.id"
                :label="getBoardingLabel(boarding)" :checked="isChecked(boarding.id)" />
            </CCol>
          </CRow>
          <CRow class="mt-4">
            <CCol :md="2">
              <CButton @click="saveTraveler" color="primary">Salvar</CButton>
            </CCol>
          </CRow>
        </CForm>

      </CModalBody>
    </CModal>
    <CRow>
      <CCol :md="2">
        <CCard v-if="packageData" class="p-2">
          <CCardBody>
            <CFormCheck @change="changeUserIsTraveler" id="flexCheckChecked" label="Você é um dos viajantes" />
            <h6 class="mt-2">Viajantes ({{allowedTravelers}})</h6>
            <CRow class="mb-2">
              <p v-if="!hasTraveler">Ainda não há viajantes cadastrados</p>
              <CCol v-else :md="2">
                <CListGroup>
                  <CListGroupItem :active="travelerIsUser(traveler)" @click=" travelerIsUser(traveler) ? null : edit(traveler)"
                    v-for="traveler in travelers" :key="traveler.document">
                    {{ traveler.name}}
                  </CListGroupItem>
                </CListGroup>
              </CCol>
            </CRow>
            <CButton @click="changeShowTravelerModal" color="primary">Novo Viajante</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>
<script>

import { PACKAGE_BY_PK } from "../../../../graphql/queries/package/getPackageByPk"
import PackageCard from "../../../../components/package/PackageCard.vue"

export default {
  name: "TravelerTour",
  data() {
    return {
      packageData: null,
      showTravelerModal: false,
      editMode: false,
      traveler: {
        boarding: "..."
      },
      user: {
        id: "aaa",
        name: "Zé Viajante"
      },
      userIsTraveler: false,
      travelers: []
    }
  },
  components: {
    PackageCard
  },
  computed: {
    hasTraveler() {
      return this.travelers.length
    },
    allowedTravelers() {
      return `${this.travelers.length}/${this.packageData.allowed_people}`
    }
  },
  methods: {
    isChecked(id) {
      return this.traveler.boarding && this.traveler.boarding === id
    },
    changeUserIsTraveler(event) {
      if (event.target.checked) {
        this.travelers.push(this.user)
      } else {
        const index = this.travelers.findIndex((traveler) => {
          return traveler.id === this.user.id
        })
        if (index > -1) { // only splice array when item is found
          this.travelers.splice(index, 1); // 2nd parameter means remove one item only
        }
      }
    },
    travelerIsUser(traveler) {
      return traveler.id === this.user.id
    },
    edit(traveler) {
      this.editMode = true
      this.traveler = traveler
      this.changeShowTravelerModal()
    },
    saveTraveler(event) {
      const formEvent = event.currentTarget
      event.preventDefault()
      event.stopPropagation()

      this.validatedCustom01 = true

      if (formEvent.checkValidity() !== false) {
        if (!this.editMode) {
          this.travelers.push(this.traveler)

        }
        this.traveler = {}
        this.changeShowTravelerModal()
        this.validatedCustom01 = false
        this.editMode = false
      }
    },
    changeBoardingData(event) {
      this.traveler.boarding = event.target.value
    },
    getBoardingLabel(boarding) {
      let address = `${boarding.address.street}, ${boarding.address.city ? boarding.address.city.name : ""}, ${boarding.address.state ? boarding.address.state.name : ""}`
      if (boarding.name) {
        address = `${boarding.name} - ${address}`
      }
      return address
    },
    changeShowTravelerModal() {
      this.showTravelerModal = !this.showTravelerModal
    }
  },
  apollo: {
    packageData: {
      query: PACKAGE_BY_PK,
      variables() {
        const id = this.$route.params.id
        return {
          id
        }
      }
    }
  },

}
</script>
<style>
.image-fit {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

@media only screen and (min-width: 760px) {
  .image-fit {
    height: 100px;
    width: 100px;
    object-fit: cover;
  }
}


.sortable {
  cursor: pointer;
}
</style>