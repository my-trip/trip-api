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
							<CRow class="mb-2">
								<h6>Origem:</h6>
								<autocomplete @input="changeOrigin" permitArbitraryValues v-model="filter.origin" :items="originItems"
									:returned="['id', 'place', 'type']" displayed="place" />
							</CRow>
							<CRow class="mb-3">
								<h6>Destino:</h6>
								<autocomplete @input="changeDestiny" permitArbitraryValues v-model="filter.destiny"
									:items="destinyItems" :returned="['id', 'place', 'type']" displayed="place" />
							</CRow>
							<CRow >
								<h6>Data</h6>
							</CRow>
							<CRow class="mb-2">
								<CCol>
									<CFormLabel class="sortable">De:</CFormLabel>
									<CFormInput required v-model="filter.init_date" id="newItemName" type="datetime-local" />
								</CCol>
							</CRow>
							<CRow class="mb-3">
								<CCol>
									<CFormLabel class="sortable">Até:</CFormLabel>
									<CFormInput required v-model="filter.end_date" id="newItemName" type="datetime-local" />
								</CCol>
							</CRow>
							<CRow class="mb-3">
								<CCol>
									<h6>Pessoas por Pacote:</h6>
									<CFormInput v-model="filter.alowePeople" @change="filterChange" id="newItemName" type="number" />
								</CCol>
							</CRow>
							<CRow>
								<CColum>
									<CButton @click="search" color="primary">Filtrar</CButton>
								</CColum>
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

import { GET_TOUR } from "../../graphql/queries/tour/getTourTraveler"
import TourCard from "../../components/tour/TourCard.vue"
import Autocomplete from 'vue-autocomplete-input-tag'
import { GET_PLACE } from "../../graphql/queries/place/getPlace"

export default {
	name: "Test",
	components: {
		TourCard,
		Autocomplete
	},
	data() {
		return {
			tour: [],
			visibleGeralFilters: true,
			visibleBoardingFilters: true,
			visibleDestinyFilters: false,
			visibleFilters: true,
			originTimeout: null,
			destinyTimeout: null,
			timer: null,
			destinyItems: [],
			originItems: [],
			filter: {
				origin: null,
				destiny: null,
				alowePeople: null,
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
						packages: {
							close_selling_date: {
								_gte: nowString
							},
							start_selling_date: {
								_lte: nowString
							}
						}
					}
				}
			}
		}
	},
	methods: {
		changeOrigin(event) {
			this.originItems = []

			if (this.originTimeout) {
				clearTimeout(this.originTimeout);
			}
			this.originTimeout = setTimeout(() => {

				this.$apollo.query({
					query: GET_PLACE,
					variables: {
						place: event.target.value
					}
				}).then(value => {
					this.originItems = value.data.places
				})
			}, "1000")
		},
		changeDestiny(event) {
			this.destinyItems = []

			if (this.destinyTimeout) {
				clearTimeout(this.destinyTimeout);
			}
			this.destinyTimeout = setTimeout(() => {

				this.$apollo.query({
					query: GET_PLACE,
					variables: {
						place: event.target.value
					}
				}).then(value => {
					this.destinyItems = value.data.places
				})
			}, "1000")
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
				boardings: {},
				packages: {
					close_selling_date: {
						_gte: nowString
					},
					start_selling_date: {
						_lte: nowString
					}
				}
			}

			if (this.filter.alowePeople) {
				where.packages.allowed_people = { _gte: this.filter.alowePeople }
			}

			if (this.filter.destiny) {
				const destinyAddress = {}
				const detiny = this.filter.destiny

				if (detiny.state && detiny.state.id) {
					destinyAddress.state_id = { _eq: detiny.state.id }
				}

				if (detiny.city && detiny.city.id) {
					destinyAddress.city_id = { _eq: detiny.city.id }
				}

				where.destiny = destinyAddress
			}

			if (this.filter.boarding) {
				const boardginAddress = {}
				const boarding = this.filter.boarding

				if (boarding.state && boarding.state.id) {
					boardginAddress.state_id = { _eq: boarding.state.id }
				}

				if (boarding.city && boarding.city.id) {
					boardginAddress.city_id = { _eq: boarding.city.id }
				}

				where.boardings.address = boardginAddress
			}
			console.log({ where })

			this.$apollo.queries.tour.refetch({
				where: where
			})
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

