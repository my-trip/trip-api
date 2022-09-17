<template>
	<CRow>
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CModal scrollable alignment="center" fullscreen="xl" size="xl" @close="changeNewItemClicked" :keyboard="false"
					:visible="newItemClicked">
					<CModalHeader>
						<CModalTitle>Viajante</CModalTitle>
					</CModalHeader>
					<CModalBody>
						<CRow class="justify-content-between">
							<CCol>
								<h6>Nome:</h6>
								<p class="text-medium-emphasis">{{ newTraveler.person.name }}</p>
							</CCol>
							<CCol>
								<h6>Documento</h6>
								<p class="text-medium-emphasis">{{ newTraveler.person.document }}</p>
							</CCol>
							<CCol>
								<h6>Telefone</h6>
								<p class="text-medium-emphasis">{{ newTraveler.person.phone }}</p>
							</CCol>
							<CCol>
								<h6>Embarque</h6>
								<p class="text-medium-emphasis">{{ newTraveler.boarding ? newTraveler.boarding.name : "Não Cadastrado"
								}}</p>
							</CCol>
						</CRow>
						<h5 class="mt-3">Detalhes do Pacote:</h5>
						<CRow>
							<CCol>
								<h6>Nome:</h6>
								<p class="text-medium-emphasis">{{ newTraveler.package.name }}</p>
							</CCol>
						</CRow>
						<h6>Itens Inclusos:</h6>
						<CTable class="mt-3 mb-0 border" hover responsive>
							<CTableHead color="primary">
								<CTableRow>
									<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
									<CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
								</CTableRow>
							</CTableHead>
							<CTableBody v-for="itemData in newTraveler.package.package_items" :key="itemData.id">
								<CTableRow>
									<CTableDataCell class="text-center" scope="row">{{ itemData.item.name }}</CTableDataCell>
									<CTableDataCell class="text-center">{{ itemData.item.description || "-" }}</CTableDataCell>
								</CTableRow>
							</CTableBody>
						</CTable>
						<h5 class="mt-3">Acompanhantes:</h5>
						<CTable class="mt-3 mb-3 border" hover responsive>
							<CTableHead color="primary">
								<CTableRow>
									<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
									<CTableHeaderCell class="text-center" scope="col">Documento</CTableHeaderCell>
									<CTableHeaderCell class="text-center" scope="col">Telefone</CTableHeaderCell>
								</CTableRow>
							</CTableHead>
							<CTableBody v-for="traveler in newTraveler.package_access.travelers" :key="traveler.id">
								<CTableRow v-if="traveler.id !== newTraveler.id">
									<CTableDataCell class="text-center" scope="row">{{ traveler.person.name }}
									</CTableDataCell>
									<CTableDataCell class="text-center" scope="row">{{ traveler.person.document }}
									</CTableDataCell>
									<CTableDataCell class="text-center" scope="row">{{ traveler.person.phone }}
									</CTableDataCell>
								</CTableRow>
							</CTableBody>
						</CTable>
					</CModalBody>
				</CModal>
				<CCardBody>
					<CRow class="mt-5">
						<h6>Filtros</h6>
					</CRow>
					<CRow class="align-items-end">
						<CCol :md="5">
							<CFormLabel>Nome</CFormLabel>
							<CFormInput v-model="filter.name" id="exampleFormControlInput1" type="text" />
						</CCol>
						<CCol :md="4">
							<CButton color="primary" @click="search">Buscar</CButton>
						</CCol>
					</CRow>
					<CToaster placement="top-end">
						<CToast :key="toast.title" v-for="(toast) in toasts">
							<CToastHeader closeButton>
								<span class="me-auto fw-bold">{{ toast.title }}</span>
							</CToastHeader>
							<CToastBody>
								{{ toast.content }}
							</CToastBody>
						</CToast>
					</CToaster>
					<CTable v-if="hasItem" class="mt-3 mb-3 border" hover responsive>
						<CTableHead color="primary">
							<CTableRow>
								<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Documento</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Telefone</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Ações</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody v-for="travelerData in traveler" :key="travelerData.id">
							<CTableRow >
								<CTableDataCell class="text-center" scope="row">{{ travelerData.person.name }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ travelerData.person.document }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">{{ travelerData.person.phone }}
								</CTableDataCell>
								<CTableDataCell class="text-center" scope="row">
									<CButton @click="() => goToEdit(travelerData)" color="primary" variant="ghost">Visualizar
									</CButton>
								</CTableDataCell>
							</CTableRow>
						</CTableBody>
					</CTable>
					<div class="pt-5" v-else>
						<p class="text-medium-emphasis text-center">Ainda não ha viajantes!</p>
					</div>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>
<script>
import { GET_TRAVELER } from '../../../../../../graphql/queries/traveler/getTravelers.js'

export default {
	name: 'TravelerTab',
	data: function () {
		return {
			traveler: [],
			where: {},
			editMode: false,
			newItemClicked: false,
			newTraveler: {
				name: null,
				description: null
			},
			filter: {
				name: null
			},
			validatedCustom01: null,
			toasts: []
		}
	},
	apollo: {
		traveler: {
			query: GET_TRAVELER,
			variables() {
				return {
					tourId: this.$route.params.id
				}
			}
		}
	},
	computed: {
		hasItem() {
			return this.traveler && this.traveler.length > 0
		}
	},
	methods: {
		createToast() {
			this.toasts.push({
				title: 'Sucesso!',
				content: 'Um novo item foi cadastrado.'
			})
		},
		goToEdit(travelerData) {
			this.editMode = true
			this.newTraveler = {
				id: travelerData.id,
				person: travelerData.person,
				boarding: travelerData.boarding,
				package: travelerData.package_access.package,
				package_access: travelerData.package_access,
				travelers: travelerData.package_access.travelers
			}
			console.log(this.newTraveler)
			this.changeNewItemClicked()
		},
		changeNewItemClicked() {
			this.newItemClicked = !this.newItemClicked
		},
		search() {

		}
	}
}
</script>
  