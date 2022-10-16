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
							<CRow>
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
				<CListGroup v-if="availabled_tours">
					<CListGroupItem v-for="tourData in availabled_tours.tours" :key="tourData.id">
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
		availabled_tours: {
			query: GET_TOUR,
			variables() {
				return {
					input: {}
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
			const where = {}

			if (this.filter.init_date) {
				where.start_date = new Date(this.filter.init_date).toISOString()
			}

			if (this.filter.end_date) {
				{
					where.end_date = new Date(this.filter.end_date).toISOString()
				}
			}

			if (this.filter.alowePeople) {
				where.allowed_people = this.filter.alowePeople
			}

			if (this.filter.destiny) {
				const destiny = this.filter.destiny

				const parameterName = destiny.type === 'state' ? 'state_id' : 'city_id'

				where.destiny = {
					[parameterName]: destiny.id
				}
			}

			if (this.filter.origin) {
				const boarding = this.filter.origin

				const parameterName = boarding.type === 'state' ? 'state_id' : 'city_id'

				where.boarding = {
					[parameterName]: boarding.id
				}
			}

			this.$apollo.queries.availabled_tours.refetch({
				start_date: where.start_date,
				end_date: where.end_date,
				allowed_people: where.allowed_people,
				destiny: where.destiny,
				boarding: where.boarding
			}).catch(e => {
				console.log(e)
			}).then(v => {
				console.log({ v })
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

