<template>


	<CContainer v-if="tour">
		<CRow class="mb-2">
			<CCol>
				<CCard class="p-2">
					<CCardBoard>
						<TourCard :tour="tour" :abstract="true" />
					</CCardBoard>
				</CCard>
			</CCol>
		</CRow>
		<CRow>
			<CCol>
				<CCard class="p-2">
					<CCardBoard>
						<h6 class="mb-3 mt-2">Pacotes</h6>
						<CListGroup>
							<CListGroupItem v-for="packageData in tour.packages" :key="packageData.id">
								<h8> {{ packageData.name }} </h8>
								<CRow>
									<p class="text-medium-emphasis"> {{ packageData.description }}</p>
								</CRow>
								<CRow class="mt-2">
									<CCol>
										<font-awesome-icon icon="fa-solid fa-user" />
										<span class="text-medium-emphasis">Até {{ availablePeople(packageData) }} pessoas</span>
									</CCol>
								</CRow>
								<CRow class="mt-2">
									<CCol>
										<font-awesome-icon icon="fa-solid fa-money-bill" />
										<span class="ml-2 text-medium-emphasis"> R${{ price(packageData) }}</span>
									</CCol>
								</CRow>
								<CRow class="mt-4">
									<CCol>
										<font-awesome-icon icon="fa-solid fa-list" />
										<h8> Itens Inclusos </h8>
										<CListGroupItem class="mt-2" v-for="packageItem in packageData.package_items" :key="packageItem.id">
											<font-awesome-icon icon="fa-solid fa-check" />
											<span class="ml-2 text-medium-emphasis"> {{ packageItem.item.name }}</span>
										</CListGroupItem>
									</CCol>
								</CRow>
								<CRow class="mt-4 mb-2">
									<CCol :sm="12">
										<CButton color="primary">Reservar</CButton>
									</CCol>
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

import { TOUR_BY_PK } from "../../../../graphql/queries/tour/tourByBk"
import TourCard from "../../../../components/tour/TourCard.vue"
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faMoneyBill, faList, faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(faMoneyBill)
library.add(faUser)
library.add(faList)
library.add(faCheck)

export default {
	name: "TravelerTour",
	data() {
		return {
			tour: null,
		}
	},
	components: {
		TourCard
	},
	apollo: {
		tour: {
			query: TOUR_BY_PK,
			variables() {
				const id = this.$route.params.id
				return {
					id
				}
			}
		}
	},
	methods: {
		availablePeople(packageData) {
			return packageData.allowed_people
		},
		price(packageData) {

			return parseFloat((packageData.price / 100).toFixed(2));
		},
		changeDestinyAddress: function (event) {
			this.filter.destiny = event
		},
		changeBoardingAddress: function (event) {
			this.filter.boarding = event
		},
		filterChange(event) {
			if (this.timer) {
				clearTimeout(this.timer)
			}

			const search = this.search
			this.timer = setTimeout(search, 1500)
		},
		search() {
			const now = new Date()
			const nowString = now.toISOString()

			const where = {
				boardings: {

				},
				packages: {
					is_available: { _eq: true },
					close_selling_date: {
						_lte: nowString
					}
				}
			}

			if (this.filter.alowePeople) {
				where.packages.allowed_people = { _eq: this.filter.alowePeople }
			}

			if (this.filter.boardingDate) {
				const date = new Date(this.filter.boardingDate)
				where.boardings.date = { _gte: date.toDateString() }
			}

			if (this.filter.destiny) {
				const destinyAddress = {}
				const detiny = this.filter.destiny

				if (detiny.state && detiny.state.id) {
					destinyAddress.state_id = { _eq: this.destiny.state.id }
				}

				if (detiny.city && detiny.city.id) {
					destinyAddress.city_id = { _eq: this.destiny.city.id }
				}

				where.destiny = destinyAddress
			}

			if (this.filter.boarding) {
				const boardginAddress = {}
				const boarding = this.filter.boarding

				if (boarding.state && boarding.state.id) {
					boardginAddress.state_id = { _eq: this.boarding.state.id }
				}

				if (boarding.city && boarding.city.id) {
					boardginAddress.city_id = { _eq: this.boarding.city.id }
				}

				where.boardings.address = boardginAddress
			}

		}

	},
}
</script>
<style>
.image-fit {
	height: 200px;
	width: 100%;
	object-fit: cover;
}

@media only screen and (min-width: 760px) {
	.image-fit {
		height: 100px;
		width: 100px;
		object-fit: cover;
	}
}


.sortable {
	cursor: pointer;
}
</style>