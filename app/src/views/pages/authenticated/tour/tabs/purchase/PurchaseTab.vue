<template>
	<CRow>
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CCardBody>
					<PurchaseModal @savePurchaseData="savePurchaseData" @closePurchaseModal="closePurchaseModal"
						:visible="purchaseModalVisible" :purchaseId="purchaseId" />
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
							<CFormLabel>Solicitante</CFormLabel>
							<CFormInput v-model="requester" placeholder="Nome ou Email" autocomplete="nome" />
						</CCol>
					</CRow>
					<CRow class="mb-5">
						<CFormLabel>Situação</CFormLabel>
						<CCol>
							<input @change="selectAllStatus" v-model="selectedAllStatus" class="form-check-input" type="checkbox"
								id="inlineCheckbox1" value="all">
							<label class="form-check-label" for="inlineCheckbox1">
								Todas
							</label>
						</CCol>
						<CCol>
							<input @change="removeAll" v-model="checkedStatus" class="form-check-input" type="checkbox"
								id="inlineCheckbox2" value="solicited">
							<label class="form-check-label" for="inlineCheckbox2">
								Novas
							</label>
						</CCol>
						<CCol>
							<input @change="removeAll" v-model="checkedStatus" class="form-check-input" type="checkbox"
								id="inlineCheckbox3" value="waiting_payment">
							<label class="form-check-label" for="inlineCheckbox3">
								Aguardando Pgto.
							</label>
						</CCol>
						<CCol>
							<input @change="removeAll" v-model="checkedStatus" class="form-check-input" type="checkbox"
								id="inlineCheckbox4" value="confirmated">
							<label class="form-check-label" for="inlineCheckbox4">
								Confirmadas
							</label>
						</CCol>
						<CCol>
							<input @change="removeAll" v-model="checkedStatus" class="form-check-input" type="checkbox"
								id="inlineCheckbox5" value="cancelled">
							<label class="form-check-label" for="inlineCheckbox5">
								Canceladas
							</label>
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
								<CTableHeaderCell class="text-center" scope="col">Situação</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Solicitante</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Pacote</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody v-for="purchaseData in sortedPurchases" :key="purchaseData.id">
							<CTableRow>
								<CTableDataCell @click="() => goToEdit(purchaseData.id)" class="text-center sortable" scope="row">
									<CBadge :color="getStatusColor(purchaseData.status)">{{ getStatusName(purchaseData.status) }}</CBadge>
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ purchaseData.person.name }}
								</CTableDataCell>
								<CTableDataCell class="text-center">{{ purchaseData.package_access.package.name }}</CTableDataCell>
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
import PurchaseModal from '../../../../../../components/purchase/PurchaseModal.vue'

export default {
	name: 'PurchaseTab',
	components: {
		PurchaseModal
	},
	data: function () {
		return {
			purchase: [],
			where: {},
			newItemClicked: false,
			requester: null,
			checkedStatus: ["solicited"],
			checkBoxAllStatus: ["solicited", "waiting_payment", "confirmated", "cancelled"],
			purchaseModalVisible: false,
			selectedAllStatus: false,
			purchaseId: null,
			validatedCustom01: null,
			toasts: []
		}
	},
	apollo: {
		purchase: {
			query: GET_PURCHASE_BY_TOUR_ID,
			variables() {
				return {
					where: {
						_and: {
							package_access: {
								package: {
									tour_id: { _eq: this.$route.params.id }
								}
							},
							status: { _in: ['solicited'] }
						}
					}
				}
			}
		}
	},
	computed: {
		sortedPurchases() {
			const statusMap = {
				"solicited": 1,
				'waiting_payment': 2,
				"confirmated": 3,
				'cancelled_by_traveler': 4,
				'automatically_cancelled': 5,
				'cancelled_by_agency': 6,
			}

			const sortedPurchases = this.purchase.map(purchase => purchase)

			sortedPurchases.sort((a, b) => {
				return statusMap[a.status] - statusMap[b.status]
			})

			return sortedPurchases
		},
		newItemColor() {
			return this.newItemClicked ? "light" : "primary"
		},
		hasBoarding() {
			return this.purchase && this.purchase.length > 0
		}
	},
	methods: {
		selectAllStatus(event) {
			if (!event.target.checked) {
				this.checkedStatus = []
				return
			}
			this.checkedStatus = this.checkBoxAllStatus
		},
		removeAll(event) {
			if (!event.target.checked) {
				this.selectedAllStatus = false
			}
		},
		goToEdit(id) {
			this.purchaseId = id
			this.purchaseModalVisible = true
		},
		savePurchaseData(event) {
			this.$apollo.queries.purchase.refetch()
			this.purchaseModalVisible = false
		},
		closePurchaseModal(event) {
			this.purchaseModalVisible = false
		},
		getStatusColor(name) {
			const statusMap = {
				"solicited": "info",
				"confirmated": "success",
				'cancelled_by_traveler': 'danger',
				'automatically_cancelled': 'danger',
				'cancelled_by_agency': "danger",
				'waiting_payment': "warning",
				'cancelled': 'danger'
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
		createToast(message) {
			this.toasts.push({
				title: 'Sucesso!',
				content: message
			})
		},
		search() {
			const variables = {
				_and: {
					package_access: {
						package: {
							tour_id: { _eq: this.$route.params.id }
						}
					}
				}
			}
			const checkedStatus = this.checkedStatus
			if (checkedStatus.length > 0) {
				const status = []
				if (checkedStatus.includes('cancelled')) {
					status.push(...['cancelled_by_traveler', 'automatically_cancelled', 'cancelled_by_agency'])
				}
				checkedStatus.forEach(value => {
					if (value !== 'cancelled') {
						status.push(value)
					}
				})
				variables._and.status = { _in: status }

			}
			const requester = this.requester
			if (this.requester) {
				variables._and.person = {

					_or: {
						name: { _ilike: `%${requester}%` },
						user: {
							email: {
								_ilike: `%${requester}%`
							}
						}
					}
				}
			}
			console.log({ variables })
			this.$apollo.queries.purchase.refetch({
				where: variables
			})

		}
	}
}
</script>

<style>
.sortable {
	cursor: pointer;
}
</style>
  