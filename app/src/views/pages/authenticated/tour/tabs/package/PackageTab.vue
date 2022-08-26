<template>
	<CRow>
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CCardBody>
					<CRow>
						<CCol :md="5">
							<CButton :color="newItemColor" @click="changeNewItemClicked">Novo Pacote</CButton>
						</CCol>
					</CRow>
					<CRow v-if="newItemClicked" class="mt-4">
						<CCol>
							<CCard class="mb-4 p-4">
								<CCardBody>
									<CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
										@submit="createPackage">
										<CRow>
											<CCol :md="12">
												<CFormLabel>Nome</CFormLabel>
												<CFormInput required v-model="newPackage.name" id="newItemName" type="text" />
											</CCol>
										</CRow>
										<CRow class="mt-2">
											<CCol :md="12">
												<CFormLabel>Descrição</CFormLabel>
												<CFormTextarea v-model="newPackage.description" id="newItemDescription" label="Example textarea"
													rows="3">
												</CFormTextarea>
											</CCol>
										</CRow>
										<CRow class="mt-2">
											<CCol :md="6">
												<CFormLabel>Quantidade Disponível</CFormLabel>
												<CFormInput required v-model="newPackage.quantity" id="newItemName" type="number" />
											</CCol>
											<CCol :md="6">
												<CFormLabel>Quantidade de Pessoas por Pacote</CFormLabel>
												<CFormInput required v-model="newPackage.allowed_people" id="newItemName" type="number" />
											</CCol>
										</CRow>
										<CRow class="mt-2">
											<CCol :md="6">
												<CFormLabel>Início das Vendas</CFormLabel>
												<CFormInput required v-model="newPackage.start_selling_date" id="newItemName"
													type="datetime-local" />
											</CCol>
											<CCol :md="6">
												<CFormLabel>Fim das Vendas</CFormLabel>
												<CFormInput v-model="newPackage.close_selling_date" id="newItemName" type="datetime-local" />
											</CCol>
										</CRow>
										<CRow class="mt-5">
											<h5>Incluir Itens</h5>
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
													<small>7 min ago</small>
												</CToastHeader>
												<CToastBody>
													{{ toast.content }}
												</CToastBody>
											</CToast>
										</CToaster>
										<CTable v-if="hasItem" class="mt-3 mb-0 border" hover responsive>
											<CTableHead color="primary">
												<CTableRow>
													<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
													<CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
													<CTableHeaderCell class="text-center" scope="col">Ação</CTableHeaderCell>
												</CTableRow>
											</CTableHead>
											<CTableBody v-for="itemData in item" :key="itemData.id">
												<CTableRow v-if="itemNotIncluded(itemData)">
													<CTableDataCell class="text-center" scope="row">{{ itemData.name }}</CTableDataCell>
													<CTableDataCell class="text-center">{{ itemData.description || "-" }}</CTableDataCell>
													<CTableDataCell class="text-center">
														<CButton @click="() => addItem(itemData)" color="primary" variant="ghost">Adicionar
														</CButton>
													</CTableDataCell>
												</CTableRow>
											</CTableBody>
										</CTable>
										<div class="pt-5" v-else>
											<p class="text-medium-emphasis text-center">Não há itens cadastrados</p>
										</div>
										<CRow class="mt-5">
											<h5>Itens Inclusos</h5>
										</CRow>
										<CTable class="mt-3 mb-0 border" hover responsive>
											<CTableHead color="primary">
												<CTableRow>
													<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
													<CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
													<CTableHeaderCell class="text-center" scope="col">Ação</CTableHeaderCell>
												</CTableRow>
											</CTableHead>
											<CTableBody v-for="packageItemData in newPackage.itens" :key="packageItemData.id">
												<CTableRow>
													<CTableDataCell class="text-center" scope="row">{{ packageItemData.name }}</CTableDataCell>
													<CTableDataCell class="text-center">{{ packageItemData.description || "-" }}</CTableDataCell>
													<CTableDataCell class="text-center">
														<CButton @click="() => removeItem(packageItemData)" color="primary" variant="ghost">Remover
														</CButton>
													</CTableDataCell>
												</CTableRow>
											</CTableBody>
										</CTable>
										<CRow class="mt-4">
											<CCol :md="2">
												<CButton color="light" @click="changeNewItemClicked">Cancelar</CButton>
											</CCol>
											<CCol :md="2">
												<CButton color="primary" type="submit">Cadastrar</CButton>
											</CCol>
										</CRow>
									</CForm>
								</CCardBody>
							</CCard>
						</CCol>
					</CRow>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>


<script>
import { GET_ITEM } from '../../../../../../graphql/queries/item/getItem.js'
import { NEW_PACKAGE } from '../../../../../../graphql/mutations/package/insertPackage'

export default {
	name: 'PackageTab',
	data: function () {
		return {
			item: [],
			where: {},
			newItemClicked: false,
			newPackage: {
				name: null,
				description: null,
				start_selling_date: null,
				close_selling_date: null,
				allowed_people: null,
				quantity: null,
				itens: []
			},
			filter: {
				name: null
			},
			validatedCustom01: null,
			toasts: []
		}
	},
	apollo: {
		item: {
			query: GET_ITEM,
			variables() {
				return {
					where: {
						tour_id: {
							_eq: this.$route.params.id
						}
					}
				}
			}
		}
	},
	computed: {
		newItemColor() {
			return this.newItemClicked ? "light" : "primary"
		},
		hasItem() {
			return this.item && this.item.length > 0
		}
	},
	methods: {
		addItem(item) {
			this.newPackage.itens.push(item)
		},
		itemNotIncluded(item) {
			const index = this.newPackage.itens.indexOf(item);
			if (index > -1) {
				return false
			}
			return true
		},
		removeItem(item) {
			const index = this.newPackage.itens.indexOf(item);
			if (index > -1) {
				this.newPackage.itens.splice(index, 1)
			}
		},
		createToast() {
			this.toasts.push({
				title: 'Sucesso!',
				content: 'Um novo pacote foi cadastrado.'
			})
		},
		changeNewItemClicked() {
			this.newItemClicked = !this.newItemClicked
		},
		createPackage(event) {
			const formEvent = event.currentTarget
			event.preventDefault()
			event.stopPropagation()

			this.validatedCustom01 = true

			if (formEvent.checkValidity() !== false) {
				const tourId = this.$route.params.id

				this.$apollo.mutate({
					mutation: NEW_PACKAGE,
					variables: {
						name: this.newPackage.name,
						description: this.newPackage.description,
						start_selling_date: this.newPackage.start_selling_date ? new Date(this.newPackage.start_selling_date).toISOString()
							: null,
						close_selling_date: this.newPackage.close_selling_date ? new Date(this.newPackage.close_selling_date) : null,
						quantity: this.newPackage.quantity ? parseInt(this.newPackage.quantity) : null,
						allowed_people: this.newPackage.allowed_people ? parseInt(this.newPackage.allowed_people) : null,
						items: this.newPackage.itens.map(item => ({ item_id: item.id })),
						tour_id: tourId,
						price: 1000,
					}
				}).then(value => {
					this.createToast()
					this.changeNewItemClicked()
					this.newPackage = {
						name: null,
						description: null,
						start_selling_date: null,
						close_selling_date: null,
						allowed_people: null,
						quantity: null,
						itens: []
					}
				}).catch(err => {
					console.log("DEU RUIN")
					console.log(err)
				})
			}
		},
		search() {
			const where = {
				tour_id: {
					_eq: this.$route.params.id
				}
			}

			if (this.filter.name && this.filter.name != "") {
				where.name = {
					_ilike: `%${this.filter.name}%`
				}
			}

			this.where = where

			this.$apollo.queries.item.refetch({
				where: this.where
			})
		}
	}
}
</script>
