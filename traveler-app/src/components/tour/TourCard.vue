<template>
	<CRow @click="() => goToTrip(tour.id)">
		<CCol md="2">
			<CImage rounded class="image-fit" :src="image" />
		</CCol>
		<CCol class="mt-3">
			<CRow>
				<h6>{{ tour.name }}</h6>
			</CRow>
			<CRow>
				<CCol>
					<p class="text-medium-emphasis"> {{ tour.description }}</p>
				</CCol>
			</CRow>
			<CRow v-if="!abstract">
				<CCol>
					<h8>A partir de R$ {{price}}</h8>
				</CCol>
				<CCol>
					<h8>Para até {{availablePeople}} pessoas</h8>
				</CCol>
				<CCol>
					<h8>Próximo embarque: {{boarding}}</h8>
				</CCol>
			</CRow>
		</CCol>
	</CRow>

</template>
<script>


export default {
	name: "TourCard",
	props: {
		tour: {
			type: Object,
		},
		abstract: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		goToTrip(id) {
			this.$router.push({ name: 'Tour', params: { id: id } })
		}
	},
	computed: {
		availablePeople() {
			let max = 1
			this.tour.packages.forEach((packageData) => {
				if (packageData.allowed_people > max) {
					max = packageData.allowed_people
				}
			})
			return max
		},
		price() {
			const packages = this.tour.packages
			let min = packages[0].price
			packages.forEach(packageData => {
				if (packageData.price < min) {
					min = packageData.price
				}
			})
			return parseFloat((min / 100).toFixed(2));
		},
		boarding() {
			return (new Date(this.tour.boarding_date)).toLocaleDateString()
		},
		image() {
			return this.tour.cover || "https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder-1024x512.png"
		}
	}
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