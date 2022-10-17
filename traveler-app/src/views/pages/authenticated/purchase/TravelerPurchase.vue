<template>
  <CContainer v-if="purchase">
    <PurchaseModal @savePurchaseData="savePurchaseData" @closePurchaseModal="closePurchaseModal"
						:visible="purchaseModalVisible" :purchaseId="purchaseId" />
    <CRow>
      <CCol>
        <CCard class="p-2">
          <CCardBoard>
            <h6 class="mb-3 mt-2">Reservas</h6>
            <CListGroup>
              <CListGroupItem @click="() => goToEdit(purchaseData.id)" v-for="purchaseData in purchase" :key="purchaseData.id">
                <CRow>
                  <h7>{{purchaseData.package_access.package.tour.name}}</h7>
                </CRow>
                <CRow>
                  <p class="text-medium-emphasis">{{purchaseData.package_access.package.name}}</p>
                </CRow>
                <CRow>
                  <CCol>
                    <CBadge :color="getStatusColor(purchaseData.status)">{{ getStatusName(purchaseData.status) }}</CBadge>
                  </CCOl>
                </CRow>
              </CListGroupItem>
            </CListGroup>
          </CCardBoard>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>
<script>
import { GET_TRAVELER_PURCHASE } from "../../../../graphql/queries/purchase/travelerPurchase"
import PurchaseModal from '../../../../components/purchase/PurchaseModal.vue'

export default {
  name: "TravelerPurchase",
  data() {
    return {
      purchase: null,
      purchaseId: null,
			purchaseModalVisible: false,
    }
  },
  apollo: {
    purchase: {
      query: GET_TRAVELER_PURCHASE,
    }
  },
  components: {
    PurchaseModal
  },
  methods: {
    savePurchaseData(event) {
			this.$apollo.queries.purchase.refetch()
			this.purchaseModalVisible = false
		},
    goToEdit(id) {
			this.purchaseId = id
			this.purchaseModalVisible = true
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
        'solicited': "SOLICITADA"
      }

      return statusMap[name]
    },
  },
}
</script>
<style>
.sortable {
  cursor: pointer;
}
</style>