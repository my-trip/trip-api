<template>
	<div class="row">
		<h5>Destino</h5>
		<div class="col-md-4">
			<CFormLabel>País</CFormLabel>
			<autocomplete permitArbitraryValues v-model="selectedCountry" :items="country" :returned="['id', 'name_pt']"
				displayed="name_pt" />
		</div>
		<div class="col-md-4">
			<CFormLabel>Estado</CFormLabel>
			<autocomplete permitArbitraryValues v-model="selectedState" :items="state" :returned="['id', 'name']"
				displayed="name" />
		</div>
		<div class="col-md-4">
			<CFormLabel>Cidade</CFormLabel>
			<autocomplete permitArbitraryValues v-model="selectedCity" :items="city" :returned="['id', 'name']"
				displayed="name" />
		</div>
	</div>

	<CForm class="g-3 mt-4">
		<div class="row">
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
		<CCol xs="12">
			<CButton color="primary" type="submit">Cadastrar</CButton>
		</CCol>

	</CForm>
</template>

<script>
import { GET_COUNTRY } from '@/graphql/queries/country/getCountry.js'
import { GET_STATE_BY_COUNTRY_ID } from '@/graphql/queries/state/getState.js'
import { GET_CITY_BY_STATE_ID } from '@/graphql/queries/city/getCity.js'
import Autocomplete from 'vue-autocomplete-input-tag'

export default {
	name: 'NewTourForm',
	components: {
		Autocomplete
	},
	apollo: {
		country: {
			query: GET_COUNTRY
		},
		state: {
			query: GET_STATE_BY_COUNTRY_ID,
			variables: {
				countryId: 0
			}
		},
		city: {
			query: GET_CITY_BY_STATE_ID,
			variables: {
				stateId: 0
			}
		},
	},
	data: function () {
		return {
			country: [],
			state: [],
			city: [],
			countryId: 1,
			selectedCountry: {},
			selectedState: {},
			selectedCity: {},
			validatedCustom01: null,
			form: {
				name: "",
				description: ""
			}
		}
	},
	watch: {
		'selectedCountry'(newValue) {
			const value = newValue && newValue.id && newValue.id == 1 ? 1 : 0
			this.selectedState = {}
			this.$apollo.queries.state.refetch({
				countryId: value
			})

		},
		'selectedState'(newValue) {
			this.selectedCity = {}
			if (newValue && newValue.id) {
				this.$apollo.queries.city.refetch({
					stateId: newValue.id
				})
			}
		}
	},
	methods: {
		handleSubmit(event) {
			const formEvent = event.currentTarget
			event.preventDefault()
			event.stopPropagation()

			this.validatedCustom01 = true

			if (formEvent.checkValidity() !== false) {

			}
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
