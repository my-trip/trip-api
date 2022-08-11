<template>
	<autocomplete permitArbitraryValues v-model="selectedCountry" :items="country" :returned="['id','name_pt']" displayed="name_pt" />
	<autocomplete permitArbitraryValues v-model="selectedState" :items="state" :returned="['id','name']" displayed="name" />
</template>

<script>
import { GET_COUNTRY } from '@/graphql/queries/country/getCountry.js'
import { GET_STATE_BY_COUNTRY_ID } from '@/graphql/queries/state/getState.js'
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
				countryId: 1
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
			// form: {
			// 	name: null,
			// 	description: null,
			// 	person: {
			// 		name: null,
			// 		cpf: true,
			// 		cnpj: false,
			// 		document: null,
			// 	},
			// 	user: {
			// 		email: null,
			// 		password: null,
			// 		confirmatedPassword: null,
			// 	},
			// },
			// validatedCustom01: null,
			// validatedDefault01: null,
			// validatedTooltip01: null,
		}
	},
	watch: {
    'selectedCountry'(newValue) {
			if (newValue && newValue.id) {
				this.$apollo.queries.state.refetch({
  				countryId: newValue.id
				})
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
