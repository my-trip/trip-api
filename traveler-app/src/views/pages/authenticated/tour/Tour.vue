<template>
	<CRow v-if="tour">
		<CCol>
			<CCard>
				<CCardBody>
					<h5 class="mb-4">Detalhes da Excursão</h5>
					<CRow class="justify-content-between">
						<CCol>
							<h6>Nome:</h6>
							<p class="text-medium-emphasis">{{ tour.name }}</p>
						</CCol>
						<CCol>
							<h6>Status:</h6>
							<p class="text-medium-emphasis">{{ statusName }}</p>
						</CCol>
						<CCol>
							<h6>Próximo Embarque:</h6>
							<p class="text-medium-emphasis">{{ boardingDate }}</p>
						</CCol>
					</CRow>
					<CRow class="justify-content-between">
						<CCol>
							<h6>País Destino:</h6>
							<p class="text-mediu	m-emphasis">
								{{ tour.destiny.country ? tour.destiny.country.name_pt : "Não Definido" }}
							</p>
						</CCol>
						<CCol>
							<h6>Estado Destino:</h6>
							<p class="text-medium-emphasis">
								{{ tour.destiny.state ? tour.destiny.state.name : "Não Definido" }}
							</p>
						</CCol>
						<CCol>
							<h6>Cidade Destino:</h6>
							<p class="text-medium-emphasis">
								{{ tour.destiny.city ? tour.destiny.city.name : "Não Definido" }}
							</p>
						</CCol>
					</CRow>
				</CCardBody>

			</CCard>
		</CCol>
	</CRow>
	<CRow v-if="tour" class="mt-2">
		<CCol :md="12">
			<CCard>
				<CCardBody>
					<CNav variant="tabs" role="tablist">
						<CNavItem>
							<CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 1"
								@click="() => { tabPaneActiveKey = 1 }">
								Viajantes
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 2"
								@click="() => { tabPaneActiveKey = 2 }">
								Reservas
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 3"
								@click="() => { tabPaneActiveKey = 3 }">
								Embarques
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 4"
								@click="() => { tabPaneActiveKey = 4 }">
								Pacotes
							</CNavLink>
						</CNavItem>
						<CNavItem>
							<CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 5"
								@click="() => { tabPaneActiveKey = 5 }">
								Itens Inclusos
							</CNavLink>
						</CNavItem>
					</CNav>
					<CTabContent>
						<CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
							<TravelerTab />
						</CTabPane>
						<CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 2">
							<PurchaseTab />
						</CTabPane>
						<CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
							<BoardingTab />
						</CTabPane>
						<CTabPane role="tabpanel" aria-labelledby="contact-tab" :visible="tabPaneActiveKey === 4">
							<PackageTab />
						</CTabPane>
						<CTabPane role="tabpanel" aria-labelledby="contact-tab" :visible="tabPaneActiveKey === 5">
							<ItemTab />
						</CTabPane>
					</CTabContent>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>
<script>
import { TOUR_BY_PK } from '../../../../graphql/queries/tour/tourByBk.js'
import ItemTab from './tabs/item/ItemTab.vue'
import PackageTab from './tabs/package/PackageTab.vue'
import BoardingTab from './tabs/boarding/BoardingTab.vue'
import PurchaseTab from './tabs/purchase/PurchaseTab.vue'
import TravelerTab from './tabs/traveler/TravelerTab.vue'

export default {
	name: 'Tour',
	components: {
		ItemTab,
		PackageTab,
		BoardingTab,
		PurchaseTab,
		TravelerTab
	},
	data: function () {
		return {
			tour: null,
			tabPaneActiveKey: 1
		}
	},
	apollo: {
		tour: {
			query: TOUR_BY_PK,
			variables() {
				return {
					id: this.$route.params.id
				}
			}
		}
	},
	computed: {
		boardingDate() {
			if (this.tour.boarding_date) {
				const date = new Date(this.tour.boarding_date)
				return date.toLocaleString()
			}
			return "Não Definido"
		},
		statusName() {
			const statusMap = {
				"created": "Aguardando Embarque",
				"finalized": "Finalizada",
				"in_progress": "Em Andamento"
			}
			return statusMap[this.tour.status]
		}
	}
}
</script>
