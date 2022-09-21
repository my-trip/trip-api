<template>
	<CRow>
		<CCrow>
			<CCard class="mb-4">
				<CCardHeader class="sortable" @click="visibleFilters = !visibleFilters">
					<h6>Filtros</h6>
				</CCardHeader>
				<CCardBody v-if="visibleFilters">
					<CRow>
						<CColumn>
							<CRow>
								<h6 class="mt-4 sortable" @click="visibleGeralFilters = !visibleGeralFilters">Geral</h6>
								<CCol md="6" v-if="visibleGeralFilters">
									<CFormLabel class="sortable">Pessoas por Pacote</CFormLabel>
									<CFormInput v-model="filter.alowePeople" @change="filterChange" id="newItemName" type="number" />
								</CCol>
								<CCol md="6" v-if="visibleGeralFilters">
									<CFormLabel>Embarque a Partir De</CFormLabel>
									<CFormInput v-model="filter.boardingDate" id="exampleFormControlInput1" type="datetime-local" />
								</CCol>
							</CRow>
							<CRow class="mt-4">
								<h6 class="mt-2 sortable" @click="visibleBoardingFilters = !visibleBoardingFilters">Origem</h6>
								<AdressForm @change-address="changeBoardingAddress" v-if="visibleBoardingFilters" :isBoarding="true" />
							</CRow>
							<CRow class="mt-4 mb-4">
								<h6 class="mt-2 sortable" @click="visibleDestinyFilters = !visibleDestinyFilters">Destino</h6>
								<AdressForm @change-address="changeDestinyAddress" v-if="visibleDestinyFilters" :isBoarding="true" />
							</CRow>
						</CColumn>
					</CRow>
				</CCardBody>
			</CCard>

		</CCrow>
		<CCrow>
			<CCol :xs="12">
				<CListGroup>
					<CListGroupItem v-for="tourData in tour" :key="tourData.id">
						<TourCard :tour="tourData" />
					</CListGroupItem>
				</CListGroup>
			</CCol>
		</CCrow>

	</CRow>
</template>
<script>


// where: {
//       boardings: {
//         date: {
//             _gte: ""
//         }
//         address: {
//           city_id: {_eq: 1},
//           state_id: {_eq: 2}
//         }
//       }
//       destiny: {
//         city_id: {_eq: 1},
//         state_id: {_eq: 2}
//       },
//       packages: {
//         is_available: {
//             _eq: true
//         },
//         close_selling_date: {
//           _lte: ""
//         },
//         allowed_people: {
//           _eq: 2
//         }
//       }

import { GET_TOUR } from "../../graphql/queries/tour/getTourTraveler"
import AdressForm from "../forms/address/Address.vue"
import TourCard from "../../components/tour/TourCard.vue"

export default {
	name: "Test",
	components: {
		AdressForm,
		TourCard
	},
	data() {
		return {
			tour: [],
			visibleGeralFilters: true,
			visibleBoardingFilters: true,
			visibleDestinyFilters: false,
			visibleFilters: false,
			timer: null,

			filter: {
				boarding: {},
				destiny: {},
				alowePeople: 0,
				boardingDate: null,
			}
		}
	},
	apollo: {
		tour: {
			query: GET_TOUR,
			variables() {
				const now = new Date()
				const nowString = now.toISOString()
				return {
					where: {
						// boardings: {
						// 	date: {
						// 		_gte: nowString
						// 	}
						// },
						packages: {
							is_available: { _eq: true },
							// close_selling_date: {
							// 	_lte: nowString
							// }
						}
					}
				}
			}
		}
	},
	methods: {
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