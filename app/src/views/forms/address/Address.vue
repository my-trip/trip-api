<template>
	<div class="row">
		<div v-if="isBoarding" class="col-md-4">
			<CFormLabel>País</CFormLabel>
			<autocomplete permitArbitraryValues v-model="address.country" :items="country" :returned="['id', 'name_pt']"
				displayed="name_pt" />
		</div>
		<div v-if="isNational" class="col-md-4">
			<CFormLabel>Estado</CFormLabel>
			<autocomplete permitArbitraryValues v-model="address.state" :items="state" :returned="['id', 'name']"
				displayed="name" />
		</div>
		<div v-if="isNational" class="col-md-4">
			<CFormLabel>Cidade</CFormLabel>
			<autocomplete permitArbitraryValues v-model="address.city" :items="city" :returned="['id', 'name']"
				displayed="name" />
		</div>
		<div v-if="isNational && !isBoarding" class="col-md-4">
			<CFormLabel>CEP</CFormLabel>
			<CFormInput v-model="address.zipCode" required placeholder="CEP" autocomplete="nome" />
		</div>
		<div v-if="isNational && !isBoarding" class="col-md-4">
			<CFormLabel>Bairro</CFormLabel>
			<CFormInput v-model="address.neighborhood" required placeholder="Bairro" autocomplete="nome" />
		</div>
		<div v-if="isNational && !isBoarding" class="col-md-4">
			<CFormLabel>Rua</CFormLabel>
			<CFormInput v-model="address.street" required placeholder="Rua" autocomplete="nome" />
		</div>
		<div v-if="isNational && !isBoarding" class="col-md-4">
			<CFormLabel>Referência</CFormLabel>
			<CFormInput v-model="address.reference" required placeholder="Ponto de referência" autocomplete="nome" />
		</div>
	</div>
</template>

<script>
import { GET_COUNTRY } from '@/graphql/queries/country/getCountry.js'
import { GET_STATE_BY_COUNTRY_ID } from '@/graphql/queries/state/getState.js'
import { GET_CITY_BY_STATE_ID } from '@/graphql/queries/city/getCity.js'
import Autocomplete from 'vue-autocomplete-input-tag'

export default {
	name: 'AddressForm',
	components: {
		Autocomplete
	},
	props: {
		isBoarding: {
			type: Boolean,
			default: false
		}
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
			cityId: 0,
			stateId: 0,
			address: {
				country: {
					id: 1,
					name_pt: "Brasil"
				},
				state: {},
				city: {},
				neighborhood: null,
				street: null,
				zipCode: null,
				reference: null
			},
			validatedCustom01: null,
			isNational: true,

		}
	},
	watch: {
		address: {
			deep: true,
			handler(newValue) {
				this.$emit("changeAddress", newValue)
			},
		},
		'address.country'(newValue) {
			console.log("AHHHHH")
			console.log(newValue)
			const value = newValue && newValue.id && newValue.id == 1 ? 1 : 0
			this.address.state = {}

			this.$apollo.queries.state.refetch({
				countryId: value
			})

			if (value == 1) {
				this.isNational = true
				return
			}
			this.isNational = false
		},
		'address.state'(newValue) {
			this.address.city = {}
			if (newValue && newValue.id) {
				this.$apollo.queries.city.refetch({
					stateId: newValue.id
				})
				return
			}
		},
		'address.city'(newValue) {
			if (newValue && newValue.id) {
				return
			}
		}
	},
	methods: {
		teste() {
			console.log("OPAAA LELE")
			this.$emit("change-address", { key: "city", value: { id: 0 } })
		}
	}
	// methods: {
	//     handleSubmit(event) {
	//         const formEvent = event.currentTarget
	//         event.preventDefault()
	//         event.stopPropagation()

	//         this.validatedCustom01 = true

	//         if (formEvent.checkValidity() !== false) {

	//         }
	//     }
	// }
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
