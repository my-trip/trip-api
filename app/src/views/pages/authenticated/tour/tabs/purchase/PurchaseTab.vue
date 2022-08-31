<template>
	<CRow>
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CCardBody>
					<CModal scrollable alignment="center" fullscreen="lg" size="lg" @close="changeNewItemClicked"
						:keyboard="false" :visible="newItemClicked">
						<CModalHeader>
							<CModalTitle>Reserva</CModalTitle>
						</CModalHeader>
						<CModalBody>
							<CRow class="justify-content-between">
								<CCol>
									<h6>Nome do Solicitante:</h6>
									<p class="text-medium-emphasis">{{ newPurchase.person.name }}</p>
								</CCol>
								<CCol>
									<h6>Email do Solicitante:</h6>
									<p class="text-medium-emphasis">{{ newPurchase.person.user.email }}</p>
								</CCol>
								<CCol>
									<h6>Telefone do Solicitante:</h6>
									<p class="text-medium-emphasis">{{ newPurchase.person.phone }}</p>
								</CCol>
							</CRow>
							<CRow class="justify-content-between">
								<CCol>
									<h6>Data da Solicitação de Reserva</h6>
									<p class="text-medium-emphasis">{{ getBoardingDate(newPurchase.created_at) }}</p>
								</CCol>
								<CCol>
									<h6>Situação da Reserva</h6>
									<p class="text-medium-emphasis">{{ newPurchase.status }}</p>
								</CCol>
							</CRow>
							<CRow>
								<CCard class="mb-4">
									<CCardBody>
										<h5 class="mb-4">Alterações</h5>
										<CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
											@submit="createItem">
											<CRow>
												<CCol :md="12">
													<CFormLabel>Observações</CFormLabel>
													<CFormTextarea v-model="newPurchase.observations" id="newItemDescription"
														label="Example textarea" rows="3">
													</CFormTextarea>
												</CCol>
											</CRow>
											<CRow class="mt-4">
												<CCol :md="12">
													<CFormLabel>Situação</CFormLabel>

													<CFormSelect aria-label="Status" :options="[
														'Escolha um novo status',
														{ label: 'Cancelada', value: 'cancelled' },
														{ label: 'Aguardando Pagamento', value: 'waiting_payment' },
														{ label: 'Confirmada', value: 'confirmated' },
														{ label: 'Solicitada', value: 'solicited' }
													]">
													</CFormSelect>
												</CCol>
											</CRow>
										</CForm>
									</CCardBody>
								</CCard>
							</CRow>
						</CModalBody>
						<CModalFooter>
							<CButton @click="changeNewItemClicked" color="secondary">Fechar</CButton>
							<CButton color="primary">Salvar Alterações</CButton>
						</CModalFooter>
					</CModal>
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
								<CTableHeaderCell class="text-center" scope="col">Pacote</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Situação</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Preço</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Nome do Solicitante</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Email do Solicitante</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Telefone do Solicitante</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Data de Solicitação</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Ações</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody v-for="purchaseData in purchase" :key="purchaseData.id">
							<CTableRow>
								<CTableDataCell class="text-center">{{ purchaseData.package.name }}</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ purchaseData.status }}</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ purchaseData.price }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ purchaseData.person.name }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ purchaseData.person.user.email }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ purchaseData.person.phone }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ getBoardingDate(purchaseData.created_at) }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">
									<CButton @click="() => goToEdit(purchaseData)" color="primary" variant="ghost">Visualizar/Editar
									</CButton>
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
  import { GET_PURCHASE_BY_TOUR_ID } from '../../../../../../graphql/queries/purchase/getPurchase.js'
  
  export default {
  	name: 'PurchaseTab',
  	data: function () {
  		return {
  			purchase: [],
  			where: {},
  			newItemClicked: false,
  			newPurchase: {
  				date: null,
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
  		purchase: {
  			query: GET_PURCHASE_BY_TOUR_ID,
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
  			return this.purchase && this.purchase.length > 0
  		}
  	},
  	methods: {
  		goToEdit(purchaseData) {
  			this.editMode = true
  			this.newPurchase = purchaseData
  			this.changeNewItemClicked()
  		},
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
  