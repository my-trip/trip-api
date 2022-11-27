<template>

  <CForm @submit="handleSubmit" class="col g-3 mt-4">
    <div class="row">
      <h5>Destino</h5>
      <AdressForm :isBoarding="true" @change-address="changeDestinyAddress" />
    </div>

    <div class="row mt-4">
      <h5>Embarque</h5>
      <p class="text-medium-emphasis small"> Após a criação da excursão, novos embarques podem ser cadastrados</p>

      <div class="col-md-3">
        <CFormInput v-model="form.date" id="exampleFormControlInput1" type="datetime-local" />
      </div>
      <!-- <div class="col-md-4">
		  	<CFormLabel>País</CFormLabel>
		  	<autocomplete permitArbitraryValues v-model="selectedCountry" :items="country" :returned="['id', 'name_pt']"
		  		displayed="name_pt" />
		  </div>
		  <div v-if="isNational" class="col-md-4">
		  	<CFormLabel>Estado</CFormLabel>
		  	<autocomplete permitArbitraryValues v-model="selectedState" :items="state" :returned="['id', 'name']"
		  		displayed="name" />
		  </div>
		  <div v-if="isNational" class="col-md-4">
		  	<CFormLabel>Cidade</CFormLabel>
		  	<autocomplete permitArbitraryValues v-model="selectedCity" :items="city" :returned="['id', 'name']"
		  		displayed="name" />
		  </div> -->
    </div>
    <div class="row mt-4">
      <AdressForm @change-address="changeBoardingAddress" />
    </div>
    <h5 class="mt-4">Outras Informações</h5>

    <div class="row mt-4">
      <div class="col-md-12">
        <CInputGroup class="mb-3">
          <CInputGroupText>
            <CIcon icon="cil-info" />
          </CInputGroupText>
          <CFormInput v-model="form.name" required placeholder="Nome da excursão" autocomplete="nome" />
        </CInputGroup>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <CInputGroup class="mb-3">
          <CInputGroupText>
            <CIcon icon="cil-info" />
          </CInputGroupText>
          <CFormTextarea v-model="form.description" id="exampleFormControlTextarea1" label="Example textarea" rows="3"
            placeholder="Sobre a agência" text="Must be 8-20 words long."></CFormTextarea>
        </CInputGroup>
      </div>
    </div>
    <UploadImages :max="1" @changed="handleImages" />
    <CCol class="mt-4" xs="12">
      <CButton color="primary" type="submit">Cadastrar</CButton>
    </CCol>
  </CForm>
</template>

<script>
import AdressForm from '../address/Address.vue'
import { NEW_TOUR } from '../../../graphql/mutations/tour/newTour.js'
import { INIT_MEDIA } from '../../../graphql/mutations/media/initMedia.js'
import UploadImages from "vue-upload-drop-images"
import axios from 'axios'

export default {
  name: 'NewTourForm',
  components: {
    AdressForm,
    UploadImages
  },
  data: function () {
    return {
      boarding: null,
      destiny: null,
      form: {
        name: "",
        description: "",
        date: Date
      }
    }
  },
  methods: {
    changeDestinyAddress: function (event) {
      this.destiny = event
    },
    changeBoardingAddress: function (event) {
      this.boarding = event
    },
    handleSubmit(event) {
      event.preventDefault()
      event.stopPropagation()

      const { name, description, date } = this.form
      const isoDate = new Date(date).toISOString()

      const boarding = this.boarding
      const destiny = this.destiny

      const variables = {
        name,
        description,
        destiny_city_id: destiny.city.id,
        destiny_country_id: destiny.country.id,
        destiny_state_id: destiny.state.id,
        boarding_city_id: boarding.city.id,
        boarding_state_id: boarding.state.id,
        boarding_street: boarding.street,
        boarding_reference: boarding.reference,
        boarding_neighborhood: boarding.neighborhood,
        boarding_zip_code: boarding.zipCode,
        boarding_date: isoDate,
      }
      this.$apollo.mutate({
        mutation: NEW_TOUR,
        variables
      }).then(value => {
        console.log(value)
      }).catch(error => {
        console.log(error)
      })
    },
    handleImages(files) {
      console.log(files[0])

      const { type } = files[0]

      this.$apollo.mutate({
        mutation: INIT_MEDIA,
        variables: {
          mimetype: type,
          type: 'tour-cover'
        }
      }).then(result => {
        var body = new FormData();
        body.append('file', files[0]);
        fetch(result.data.init_media.signed_url, {
          method: 'PUT', body: body, headers: {
            'Content-Type': type
          }
        }).then(result => {
          console.log(result)
        }).catch(e => console.log(e));
        // axios.put(result.data.init_media.signed_url, files[0], {
        //   headers: { 'Content-Type': files[0].type }
        // }).then(result => console.log(result)).catch(e => console.log(e))
      }).catch(err => {
        console.log({ err })
      })
    }
  }
  // computed: {

  // 	requiredRepeatPassword: function () {
  // 		const confirmatedPassword = this.form.user.confirmatedPassword
  // 		if (!confirmatedPassword || confirmatedPassword == "") {
  // 			return true
  // 		}
  // 		return false
  // 	},
  // 	repeatPasswordValidation: function () {
  // 		const confirmatedPassword = this.form.user.confirmatedPassword
  // 		if (confirmatedPassword !== this.form.user.password) {
  // 			return true
  // 		}
  // 		return false
  // 	},
  // },
  // methods: {
  // 	handleSubmit(event) {
  // 		const formEvent = event.currentTarget
  // 		event.preventDefault()
  // 		event.stopPropagation()

  // 		this.validatedCustom01 = true

  // 		if (formEvent.checkValidity() !== false) {
  // 			const form = this.form
  // 			this.$emit('registerSubmit', {
  // 				name: form.name,
  // 				description: form.description,
  // 				person: {
  // 					name: form.person.name,
  // 					document: form.person.document,
  // 					document_type: form.person.cpf ? 'CPF' : 'CNPJ'
  // 				},
  // 				user: {
  // 					email: form.user.email,
  // 					password: form.user.password,
  // 				}
  // 			})
  // 		}
  // 	}
  // }
}
</script>

<style>
input {
  width: 100%;
  border: 1px solid #ccc;
  color: #666;
  border-radius: 10px;
  outline: none;
  padding: 9px 14px;
  box-sizing: border-box;
  font-size: 14px;
}

.vue-autocomplete-input-tag-items {
  border: 1px solid #ccc;
  max-height: 200px;
  margin-top: 8px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  overflow: auto;
}

.vue-autocomplete-input-tag-item {
  padding: 6px 16px;
  color: #4a4a4a;
  max-width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
}

.vue-autocomplete-input-tag-item:hover {
  background-color: #e8e8e8;
}
</style>
