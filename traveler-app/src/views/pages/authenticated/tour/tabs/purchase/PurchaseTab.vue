<template>
	<CRow>
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CCardBody>
					<CModal scrollable alignment="center" fullscreen="xl" size="xl" @close="changeNewItemClicked"
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
									<p class="text-medium-emphasis">{{ getStatusName(newPurchase.status) }}</p>
								</CCol>
							</CRow>
							<h5 class="mt-3">Detalhes do Pacote:</h5>
							<CRow>
								<CCol>
									<h6>Nome:</h6>
									<p class="text-medium-emphasis">{{ newPurchase.package_access.package.name }}</p>
								</CCol>
							</CRow>
							<CRow>
								<CCol>
									<h6>Quantidade Total Liberada:</h6>
									<p class="text-medium-emphasis">{{ newPurchase.package_access.package.quantity }}</p>
								</CCol>
								<CCol>
									<h6>Reservas Confirmadas</h6>
									<p class="text-medium-emphasis">{{ newPurchase.package_access.package.confirmateds.aggregate.count }}
									</p>
								</CCol>
								<CCol>
									<h6>Reservas Aguardando Pagamento</h6>
									<p class="text-medium-emphasis">{{ newPurchase.package_access.package.confirmateds.aggregate.count }}
									</p>
								</CCol>
							</CRow>
							<CRow>
								<CCol>
									<CAlert v-if="!getIsAvailableToConfirmated(newPurchase)" color="warning">O pacote ja atingiu o
										limite de reservas!</CAlert>
								</CCol>
							</CRow>
							<h5 class="mt-3">Viajantes</h5>
							<CTable class="mt-3 mb-3 border" hover responsive>
								<CTableHead color="primary">
									<CTableRow>
										<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
										<CTableHeaderCell class="text-center" scope="col">Documento</CTableHeaderCell>
										<CTableHeaderCell class="text-center" scope="col">Telefone</CTableHeaderCell>
									</CTableRow>
								</CTableHead>
								<CTableBody v-for="traveler in newPurchase.package_access.travelers" :key="traveler.id">
									<CTableRow>
										<CTableDataCell class="text-center" scope="row">{{ traveler.person.name }}
										</CTableDataCell>
										<CTableDataCell class="text-center" scope="row">{{ traveler.person.document }}
										</CTableDataCell>
										<CTableDataCell class="text-center" scope="row">{{ traveler.person.phone }}
										</CTableDataCell>
									</CTableRow>
								</CTableBody>
							</CTable>
							<CRow>
								<CCard class="mb-4">
									<CCardBody>
										<h5 class="mb-4">Alterações</h5>
										<CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
											@submit="updatePurchase">
											<CRow>
												<CCol :md="12">
													<CFormLabel>Observações</CFormLabel>
													<CFormTextarea v-model="newPurchase.observation" id="newItemDescription"
														label="Example textarea" rows="3">
													</CFormTextarea>
												</CCol>
											</CRow>
											<CRow class="mt-4">
												<CCol :md="12">
													<CFormLabel>Situação</CFormLabel>
													<CFormSelect @change="changeSelectValue" aria-label="Status"
														:options="getOptions(newPurchase)">
													</CFormSelect>
													<p class="text-medium-emphasis mt-3" v-if="!getIsAvailableToConfirmated(newPurchase)">*Não é
														possível confirmar essa reserva pois não há pacotes disponíveis*</p>
												</CCol>
											</CRow>
											<CRow class="mt-4">
												<CCol :md="2">
													<CButton @click="changeNewItemClicked" color="secondary">Fechar</CButton>
												</CCol>
												<CCol :md="2">
													<CButton @click="submit" color="primary">Salvar</CButton>
												</CCol>
											</CRow>
										</CForm>
									</CCardBody>
								</CCard>
							</CRow>
						</CModalBody>
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
					<CRow>
						<h6>Filtros</h6>
					</CRow>
					<CRow class="mt-2 mb-4">
						<CCol>
							<CFormLabel>Pacote</CFormLabel>
							<CFormSelect :options="[]"></CFormSelect>
						</CCol>
						<CCol>
							<CFormLabel>Situação</CFormLabel>
							<CFormSelect :options="[]"></CFormSelect>
						</CCol>
						<CCol>
							<CFormLabel>Solicitante</CFormLabel>
							<CFormInput placeholder="Nome ou Email" autocomplete="nome" />
						</CCol>
					</CRow>
					<CRow class="justify-content-end">
						<CCol>
							<CButton color="primary" @click="search">Buscar</CButton>
						</CCol>
					</CRow>
					<CTable v-if="hasBoarding" class="mt-4 mb-0 border" hover responsive>
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
							<CTableRow :color="getStatusColor(purchaseData.status)">
								<CTableDataCell class="text-center">{{ purchaseData.package_access.package.name }}</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ getStatusName(purchaseData.status) }}
								</CTableDataCell>
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
						<p class="text-medium-emphasis text-center">Ainda não há reservas</p>
					</div>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>
<script>
import { GET_PURCHASE_BY_TOUR_ID } from '../../../../../../graphql/queries/purchase/getPurchase.js'
import { UPDATE_PURCHASE } from '../../../../../../graphql/mutations/purchase/updatePurchase'
export default {
	name: 'PurchaseTab',
	data: function () {
		return {
			purchase: [],
			where: {},
			newItemClicked: false,
			newPurchase: {
				id: null,
				selectedStatus: {},
				observation: "",
				status: null,
				package: null,
				price: null,
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
		getIsAvailableToConfirmated(purchaseData) {
			const confirmateds = purchaseData.package_access.package.confirmateds.aggregate.count
			const quantity = purchaseData.package_access.package.quantity

			return confirmateds < quantity
		},
		getOptions(purchaseData) {
			const defaultOptions = [
				'Escolha um novo status',
				{ label: 'Cancelada', value: 'cancelled' },
				{ label: 'Aguardando Pagamento', value: 'waiting_payment' },
			]

			if (this.getIsAvailableToConfirmated(purchaseData)) {
				{
					defaultOptions.push({ label: 'Confirmada', value: 'confirmated' })
				}
			}

			return defaultOptions
		},
		changeSelectValue(event) {
			if (event.target.value !== 'Escolha um novo status') {
				this.newPurchase.selectedStatus = event.target.value
			}
		},
		goToEdit(purchaseData) {
			this.editMode = true
			console.log({ purchaseData })
			this.newPurchase = {
				id: purchaseData.id,
				observation: purchaseData.observation,
				selectedStatus: {},
				status: purchaseData.status,
				package: purchaseData.package,
				price: purchaseData.price,
				person: purchaseData.person,
				package_access: purchaseData.package_access
			}
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
		getStatusColor(name) {
			const statusMap = {
				"solicited": "light",
				"cancelled": "danger",
				"confirmated": "success",
				'waiting_payment': "warning"
			}
			return statusMap[name]
		},
		getStatusName(name) {
			const statusMap = {
				'cancelled': 'Cancelada',
				'waiting_payment': "Aguardando Pagamento",
				'confirmated': 'Confirmada',
				'solicited': "Solicitadata"

			}

			return statusMap[name]
		},
		createToast(message) {
			this.toasts.push({
				title: 'Sucesso!',
				content: message
			})
		},
		changeNewItemClicked() {
			this.newItemClicked = !this.newItemClicked
		},
		updatePurchase(event) {
			const formEvent = event.currentTarget
			event.preventDefault()
			event.stopPropagation()

			this.validatedCustom01 = true

			if (formEvent.checkValidity() !== false) {
				this.$apollo.mutate({
					mutation: UPDATE_PURCHASE,
					variables: {
						id: this.newPurchase.id,
						observation: this.newPurchase.observation,
						status: this.newPurchase.selectedStatus || this.newPurchase.status
					}
				}).then(value => {
					this.createToast("A Reserva foi atualizada")
					this.editMode = false
					this.changeNewItemClicked()
					this.newPurchase = {
						id: null,
						observation: null,
						status: null
					}
					this.$apollo.queries.purchase.refetch()
				})
				this.validatedCustom01 = false
			}
		}
	}
}
</script>
  