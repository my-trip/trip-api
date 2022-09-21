<template>


	<CContainer v-if="tour">
		<CRow>
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
				<h6>Pacotes</h6>
				<CRow>

				</CRow>
			</CCol>
		</CRow>

	</CContainer>
</template>
<script>

import { TOUR_BY_PK } from "../../../../graphql/queries/tour/tourByBk"
import TourCard from "../../../../components/tour/TourCard.vue"

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