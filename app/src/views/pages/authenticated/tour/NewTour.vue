<template>
	<CRow>
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CRow>
					<h2>Nova Excursão</h2>
				</CRow>
				<CCardBody>
					<newTourForm />
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>


<script>
// import AgencyRegisterForm from '@/views/forms/agency/register.vue'
// import Auth from '@/mixins/auth'
import NewTourForm from "@/views/forms/tour/NewTour.vue"
import cep from 'cep-promise'

export default {
	name: 'NewTour',
	//   mixins: [Auth],
	components: {
		NewTourForm,
	},
	mounted () {
		cep("29060290").then( value => {
			console.log(value)
		})
	}
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
