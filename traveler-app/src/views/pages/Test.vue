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
export default {
	name: "Test",
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