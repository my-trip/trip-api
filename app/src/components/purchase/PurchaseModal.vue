<template>
	<CModal scrollable alignment="center" fullscreen="xl" size="xl" @close="close" :keyboard="false" :visible="visible">
		<CModalHeader>
			<CModalTitle>Reserva</CModalTitle>
		</CModalHeader>
		<CModalBody v-if="this.purchase">
			<CRow class="justify-content-between">
				<CCol>
					<h6>Nome do Solicitante:</h6>
					<p class="text-medium-emphasis">{{ purchase.person.name }}</p>
				</CCol>
				<CCol>
					<h6>Email do Solicitante:</h6>
					<p class="text-medium-emphasis">{{ purchase.person.user.email }}</p>
				</CCol>
				<CCol>
					<h6>Telefone do Solicitante:</h6>
					<p class="text-medium-emphasis">{{ purchase.person.phone }}</p>
				</CCol>
			</CRow>
			<CRow class="justify-content-between">
				<CCol>
					<h6>Preço:</h6>
					<p class="text-medium-emphasis">R$ {{ parseFloat((purchase.price/100).toFixed(2))}}</p>
				</CCol>
				<CCol>
					<h6>Situação</h6>
					<CBadge :color="getStatusColor(purchase.status)">{{ getStatusName(purchase.status) }}</CBadge>
				</CCol>
			</CRow>
			<h5 class="mt-3">Detalhes do Pacote:</h5>
			<CRow>
				<CCol>
					<h6>Nome:</h6>
					<p class="text-medium-emphasis">{{ purchase.package_access.package.name }}</p>
				</CCol>
			</CRow>
			<CRow>
				<CCol>
					<h6>Itens Inclusos</h6>
					<CTable class="mt-3 mb-3 border" hover responsive>
						<CTableHead color="primary">
							<CTableRow>
								<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody v-for="item in purchase.package_access.package.package_items" :key="item.id">
							<CTableRow>
								<CTableDataCell class="text-center" scope="row">{{ item.item.name }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ item.item.description }}
								</CTableDataCell>
							</CTableRow>
						</CTableBody>
					</CTable>
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
				<CTableBody v-for="traveler in purchase.package_access.travelers" :key="traveler.id">
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
						<CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01" @submit="updatePurchase">
							<CRow>
								<CCol :md="12">
									<CFormLabel>Observações</CFormLabel>
									<CFormTextarea v-model="purchase.observation" id="newItemDescription" label="Example textarea"
										rows="3">
									</CFormTextarea>
								</CCol>
							</CRow>
							<CRow v-if="!statusInBlackList" class="mt-4">
								<CCol :md="12">
									<CFormLabel>Situação</CFormLabel>
									<CFormSelect  @change="changeSelectValue" aria-label="Status" :options="getOptions()">
									</CFormSelect>
								</CCol>
							</CRow>
							<CRow class="mt-4">
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

</template>
<script>
import { UPDATE_PURCHASE } from '../../graphql/mutations/purchase/updatePurchase'
import { GET_PURCHASE_BY_PK } from '../../graphql/queries/purchase/getPurchaseByPk.js'

export default {
	name: 'PurchaseModal',
	props: {
		purchaseId: {
			type: String,
		},
		visible: {
			type: Boolean
		}
	},
	data: function () {
		return {
			purchase: null,
			where: {},
			filter: {
				name: null
			},
			validatedCustom01: null,
			selectedStatus: {},
			toasts: []
		}
	},
	apollo: {
		purchase: {
			query: GET_PURCHASE_BY_PK,
			variables() {
				return {
					id: this.purchaseId
				}
			},
			skip() {
				return !this.purchaseId
			}
		}
	},
	computed: {
		statusInBlackList() {
			return this.statusBlackList.includes(this.purchase.status)
		},
		statusBlackList() {
			return ["cancelled_by_traveler", 'automatically_cancelled', 'cancelled_by_agency']
		}
	},
	methods: {
		close() {
			this.$emit("closePurchaseModal")
		},
		getOptions() {
			const defaultOptions = [
				'Escolha um novo status',
				{ label: 'Cancelada', value: 'cancelled_by_agency' },
				{ label: 'Aguardando Pagamento', value: 'waiting_payment' },
				{ label: 'Confirmada', value: 'confirmated' }
			]
			return defaultOptions
		},
		changeSelectValue(event) {
			if (event.target.value !== 'Escolha um novo status') {
				this.selectedStatus = event.target.value
			}
		},
		getStatusColor(name) {
			const statusMap = {
				"solicited": "info",
				"confirmated": "success",
				'cancelled_by_traveler': 'danger',
				'automatically_cancelled': 'danger',
				'cancelled_by_agency': "danger",
				'waiting_payment': "warning"
			}
			return statusMap[name]
		},
		getStatusName(name) {
			const statusMap = {
				'cancelled_by_traveler': 'CANCELADA PELO VIAJANTE',
				'automatically_cancelled': 'CANCELADA AUTOMATICAMENTE',
				'cancelled_by_agency': "CANCELADA PELA AGÊNCIA",
				'waiting_payment': "AGUARDANDO PAGAMENTO",
				'confirmated': 'CONFIRMADA',
				'solicited': "NOVA"
			}

			return statusMap[name]
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
						id: this.purchase.id,
						observation: this.purchase.observation,
						status: this.selectedStatus || this.purchase.status
					}
				}).then(value => {
					this.$emit("savePurchaseData")
				})
			}
		}
	}
}
</script>
  