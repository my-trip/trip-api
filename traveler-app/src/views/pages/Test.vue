<template>
	<CRow>

		<CCol :xs="12">
			<CListGroup>
				<CListGroupItem>
					<CRow>
						<CCol md="2">
							<CImage rounded class="image-fit"
								src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/34/01/06/fernando-de-noronha.jpg?w=700&h=500&s=1 1x,https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/34/01/06/fernando-de-noronha.jpg?w=1400&h=900&s=1 2x" />
						</CCol>
						<CCol class="mt-3">
							<CRow>
								<h6>Passeio por Noronha</h6>
							</CRow>
							<CRow>
								<CCol>
									<p class="text-medium-emphasis"> Rio de Janeiro, Fernando de Noronha</p>
								</CCol>

							</CRow>
							<CRow>
								<CCol>
									<h8>R$50,00 a R$300,00</h8>
								</CCol>
								<CCol>
									<h8>1 a 5 pessoas</h8>
								</CCol>
								<CCol>
									<h8>05/02/2022 - 28/02/2022 </h8>
								</CCol>
							</CRow>
						</CCol>
					</CRow>
				</CListGroupItem>
				<CListGroupItem>
					<CRow>
						<CCol md="2">
							<CImage rounded class="image-fit"
								src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/34/01/06/fernando-de-noronha.jpg?w=700&h=500&s=1 1x,https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/34/01/06/fernando-de-noronha.jpg?w=1400&h=900&s=1 2x" />
						</CCol>
						<CCol>
							<CRow>
								<h6>Passeio por Noronha</h6>
							</CRow>
							<CRow>
								<CCol>
									<p class="text-medium-emphasis"> Rio de Janeiro, Fernando de Noronha</p>
								</CCol>

							</CRow>
							<CRow>
								<CCol>
									<h8>R$50,00 a R$300,00</h8>
								</CCol>
								<CCol>
									<h8>1 a 5 pessoas</h8>
								</CCol>
								<CCol>
									<h8>05/02/2022 - 28/02/2022 </h8>
								</CCol>
							</CRow>
						</CCol>
					</CRow>
				</CListGroupItem>
				<CListGroupItem>
					<CRow>
						<CCol md="2">
							<CImage rounded class="image-fit"
								src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/34/01/06/fernando-de-noronha.jpg?w=700&h=500&s=1 1x,https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/34/01/06/fernando-de-noronha.jpg?w=1400&h=900&s=1 2x" />
						</CCol>
						<CCol>
							<CRow>
								<h6>Passeio por Noronha</h6>
							</CRow>
							<CRow>
								<CCol>
									<p class="text-medium-emphasis"> Rio de Janeiro, Fernando de Noronha</p>
								</CCol>
							</CRow>
							<CRow>
								<CCol>
									<h8>R$50,00 a R$300,00</h8>
								</CCol>
								<CCol>
									<h8>1 a 5 pessoas</h8>
								</CCol>
								<CCol>
									<h8>05/02/2022 - 28/02/2022 </h8>
								</CCol>
							</CRow>
						</CCol>
					</CRow>
				</CListGroupItem>
			</CListGroup>
		</CCol>
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
export default {
	name: "Test",
	data() {
		return {
			tour: [],
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
				const nowString = now.toDateString()
				return {
					where: {
						boardings: {
							date: {
								_gte: nowString
							}
						},
						packages: {
							is_available: true,
							close_selling_date: {
								_lte: nowString
							}
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
		search() {
			const where = {
				packages: {
					is_available: { _eq: true },
					close_selling_date: {
						_lte: nowString
					}
				}
			}

			if (this.filter.alowePeople) {
				where.packages.allowed_people._eq = this.filter.alowePeople
			}

			if (this.filter.boardingDate) {
				const date = new Date(this.filter.boardingDate)
				where.boardings.date._gte = date.toDateString()
			}

			if (this.filter.destiny) {
				const destinyAddress = {}

				if (this.destiny.state.id) {
					destinyAddress.state_id._eq = this.destiny.state.id
				}

				if (this.destiny.city.id) {
					destinyAddress.city_id._eq = this.destiny.city.id
				}

				where.destiny = destinyAddress
			}

			if (this.filter.boarding) {
				const boardginAddress = {}

				if (this.boarding.state.id) {
					boardginAddress.state_id._eq = this.boarding.state.id
				}

				if (this.boarding.city.id) {
					boardginAddress.city_id._eq = this.boarding.city.id
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
</style>