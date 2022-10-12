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
          <CFormCheck v-if="!userInPurchase" :checked="travelerIsUser(traveler)" @change="changeUserIsTraveler"
            id="flexCheckChecked" label="Usar dados do usuário" />
          <CRow class="mt-4">
            <CCol :md="12">
              <CFormLabel>Nome</CFormLabel>
              <CFormInput :disabled="traveler.isUser" v-model="traveler.name" id="exampleFormControlInput1"
                type="text" />
            </CCol>
          </CRow>
          <CRow class="mt-4">
            <CCol :md="12">
              <CFormLabel>CPF</CFormLabel>
              <CFormInput :disabled="traveler.isUser" v-model="traveler.document" id="exampleFormControlInput1"
                type="text" />
            </CCol>
          </CRow>
          <CRow class="mt-4">
            <CCol :md="12">
              <CFormLabel>Telefone</CFormLabel>
              <CFormInput :disabled="traveler.isUser" v-model="traveler.phone" id="exampleFormControlInput1"
                type="text" />
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
      <CCol>
        <CCard v-if="packageData" class="p-2">
          <CCardBody>
            <h6 class="mt-2">Viajantes ({{allowedTravelers}})</h6>
            <CRow class="mb-2">
              <p v-if="!hasTraveler">Ainda não há viajantes cadastrados</p>
              <CCol v-else>
                <CListGroup>
                  <CListGroupItem :active="travelerIsUser(traveler)" v-for="traveler in travelers"
                    :key="traveler.document">
                    <CRow class="justify-content-between">
                      <CCol :xs="8">
                        {{traveler.name}}
                      </CCol>
                      <CCol :xs="4">
                        <CRow>
                          <CCol>
                            <font-awesome-icon @click="edit(traveler)" icon="fa-solid fa-edit" />
                          </CCol>
                          <CCol @click="() => removeTraveler(traveler)">
                            <font-awesome-icon icon="fa-solid fa-close" />
                          </CCol>
                        </CRow>

                      </CCol>
                    </CRow>
                  </CListGroupItem>
                </CListGroup>
              </CCol>
            </CRow>
            <CButton :disabled="disabledButton" @click="addNewTraveler" color="primary">Novo Viajante</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <CCard v-if="packageData" class="p-2">
          <CButton :disabled="disabledPurchasedButton" @click="createPurchase" color="primary">Reservar</CButton>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>
<script>
import { GET_ME } from "../../../../graphql/queries/auth/me"
import { PACKAGE_BY_PK } from "../../../../graphql/queries/package/getPackageByPk"
import { CREATE_USER_PURCHASE } from "../../../../graphql/mutations/purchase/createPurchase"
import PackageCard from "../../../../components/package/PackageCard.vue"
import { faEdit, faClose } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEdit)
library.add(faClose)

export default {
  name: "TravelerTour",
  data() {
    return {
      packageData: null,
      showTravelerModal: false,
      editMode: false,
      me: null,
      traveler: {
        boarding: null
      },
      user: {
        id: "aaa",
        name: "Zé Viajante"
      },
      userIsTraveler: false,
      travelers: []
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
    },
    me: {
      query: GET_ME,
    }
  },
  components: {
    PackageCard
  },
  computed: {
    userInPurchase() {
      for (const traveler of this.travelers) {
        if (traveler.isUser) {
          return true
        }
      }
      return false
    },
    disabledPurchasedButton() {
      return !this.travelers.length
    },
    hasTraveler() {
      return this.travelers.length
    },
    allowedTravelers() {
      return `${this.travelers.length}/${this.packageData.allowed_people}`
    },
    disabledButton() {
      return this.travelers.length >= this.packageData.allowed_people
    }
  },
  methods: {
    removeTraveler(travelerData) {
      const index = this.travelers.findIndex((traveler) => {
        return travelerData.document === traveler.document
      })
      if (index > -1) { // only splice array when item is found
        this.travelers.splice(index, 1); // 2nd parameter means remove one item only
      }
    },
    createPurchase() {
      const travelersToCreate = this.travelers.map(traveler => {
        if (traveler.isUser) {
          return {
            boarding_id: traveler.boarding,
            person_id: this.me.me.person.id
          }
        }

        return {
          boarding_id: traveler.boarding,
          person: {
            name: traveler.name,
            phone: traveler.phone,
            document: traveler.document
          }
        }
      })

      this.$apollo.mutate({
        mutation: CREATE_USER_PURCHASE,
        variables: {
          package_id: this.packageData.id,
          travelers: travelersToCreate
        }
      }).then(value => {
        console.log("CRIOOOOOOOU")
      }).catch(err => {
        console.log("DEU RUIN")
        console.log(err)
      })
    },
    isChecked(id) {
      return this.traveler.boarding && this.traveler.boarding === id
    },
    changeUserIsTraveler(event) {
      if (event.target.checked) {
        const traveler = {
          name: this.me.me.person.name,
          document: this.me.me.person.document,
          phone: this.me.me.person.phone,
          boarding: this.packageData.tour.boardings[0].id,
          isUser: true
        }
        this.traveler = traveler
      } else {
        this.traveler = {}
      }
    },
    addNewTraveler() {
      console.log("....")
      this.traveler = {
        boarding: this.packageData.tour.boardings[0].id,
      }
      this.changeShowTravelerModal()
    },
    travelerIsUser(traveler) {
      return traveler.isUser
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
      console.log("AHHH")
      this.showTravelerModal = !this.showTravelerModal
    }
  }
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