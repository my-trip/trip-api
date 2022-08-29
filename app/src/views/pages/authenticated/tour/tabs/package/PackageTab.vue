<template>
	<CRow>
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
		<CCol :md="12">
			<CCard class="mb-4 p-4">
				<CCardBody>
					<CRow>
						<CCol :md="5">
							<CButton :color="newItemColor" @click="createNewPackage">Novo Pacote</CButton>
						</CCol>
					</CRow>
					<CRow v-if="newItemClicked" class="mt-4">
						<CCol>
							<CCard class="mb-4 p-4">
								<CCardBody>
									<CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01" @submit="submit">
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
										<CRow class="mt-2">
											<CCol :md="6">
												<CFormLabel>Preço</CFormLabel>
												<CurrencyInput v-model="newPackage.price" :options="{ currency: 'BRL' }" />
											</CCol>
										</CRow>
										<CRow class="mt-2">
											<CCol :md="6">
												<CFormLabel>Disponibilidade</CFormLabel>
												<CFormSwitch @change="changeAvailable" :checked="newPackage.is_available"
													label="Esse pacote está disponivel para a venda" id="formSwitchCheckDefault" />
											</CCol>
										</CRow>
										<CRow v-if="!editMode" class="mt-5">
											<h5>Incluir Itens</h5>
										</CRow>
										<CRow v-if="!editMode" class="align-items-end">
											<CCol :md="5">
												<CFormLabel>Nome</CFormLabel>
												<CFormInput v-model="filter.name" id="exampleFormControlInput1" type="text" />
											</CCol>
											<CCol :md="4">
												<CButton color="primary" @click="search">Buscar</CButton>
											</CCol>
										</CRow>

										<CTable v-if="hasItem && !editMode" class="mt-3 mb-0 border" hover responsive>
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
										<CRow class="mt-5">
											<h5>Itens Inclusos</h5>
										</CRow>
										<CTable class="mt-3 mb-0 border" hover responsive>
											<CTableHead color="primary">
												<CTableRow>
													<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
													<CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
													<CTableHeaderCell v-if="!editMode" class="text-center" scope="col">Ação</CTableHeaderCell>
												</CTableRow>
											</CTableHead>
											<CTableBody v-for="packageItemData in newPackage.itens" :key="packageItemData.id">
												<CTableRow>
													<CTableDataCell class="text-center" scope="row">{{ packageItemData.name }}</CTableDataCell>
													<CTableDataCell class="text-center">{{ packageItemData.description || "-" }}</CTableDataCell>
													<CTableDataCell v-if="!editMode" class="text-center">
														<CButton @click="() => removeItem(packageItemData)" color="primary" variant="ghost">
															Remover
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
												<CButton color="primary" type="submit">{{ editMode ? "Atualizar" : "Cadastrar" }}</CButton>
											</CCol>
										</CRow>
									</CForm>
								</CCardBody>
							</CCard>
						</CCol>
					</CRow>
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
					<CTable v-if="hasPackage" class="mt-3 mb-0 border" hover responsive>
						<CTableHead color="primary">
							<CTableRow>
								<CTableHeaderCell class="text-center" scope="col">Nome</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Descrição</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Status</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Pessoas por Pacote</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Qtd. Liberada</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Inicio das Vendas</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Fechamento das Vendas</CTableHeaderCell>
								<CTableHeaderCell class="text-center" scope="col">Ações</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody v-for="packageData in packages" :key="packageData.id">
							<CTableRow :color="getStatusColor(packageData.is_available)" v-if="itemNotIncluded(packageData)">
								<CTableDataCell class="text-center" scope="row">{{ packageData.name }}</CTableDataCell>
								<CTableDataCell class="text-center">{{ packageData.description || "-" }}</CTableDataCell>
								<CTableHeaderCell class="text-center" scope="col">{{ getStatusName(packageData.is_available) }}
								</CTableHeaderCell>
								<CTableDataCell class="text-center">{{ packageData.allowed_people || "-" }}</CTableDataCell>
								<CTableDataCell class="text-center">{{ packageData.quantity || "-" }}</CTableDataCell>
								<CTableDataCell class="text-center">{{ packageData.start_selling_date ?
										new Date(packageData.start_selling_date).toLocaleString() : "-"
								}}</CTableDataCell>
								<CTableDataCell class="text-center">{{ packageData.close_selling_date ?
										new Date(packageData.close_selling_date).toLocaleString() : "-"
								}}</CTableDataCell>
								<CTableDataCell class="text-center">
									<CButton @click="() => goToEdit(packageData)" color="primary" variant="ghost">Visualizar/Editar
									</CButton>
								</CTableDataCell>
							</CTableRow>
						</CTableBody>
					</CTable>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
</template>
<script>

import { GET_ITEM } from '../../../../../../graphql/queries/item/getItem.js'
import { GET_PACKAGE } from '../../../../../../graphql/queries/package/getPackage'
import { NEW_PACKAGE } from '../../../../../../graphql/mutations/package/insertPackage'
import { UPDATE_PACKAGE } from '../../../../../../graphql/mutations/package/updatePackage'
import CurrencyInput from '../../../../../forms/CurrencyInput.vue'
import moment from 'moment'

export default {
	name: 'PackageTab',
	components: { CurrencyInput },
	data: function () {
		return {
			item: [],
			packages: [],
			where: {},
			available: true,
			newItemClicked: false,
			editMode: false,
			newPackage: {
				name: null,
				description: null,
				start_selling_date: null,
				close_selling_date: null,
				allowed_people: null,
				is_available: true,
				quantity: null,
				price: 0.0,
				previousItens: [],
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
		packages: {
			query: GET_PACKAGE,
			variables() {
				return {
					where: {
						tour_id: {
							_eq: this.$route.params.id
						}
					}
				}
			}
		},
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
		hasPackage() {
			return this.packages && this.packages.length > 0
		},
		hasItem() {
			return this.item && this.item.length > 0
		}
	},
	methods: {
		getStatusName(isAvailable) {
			return isAvailable ? "Disponível" : "Indisponível"
		},
		getStatusColor(isAvailable) {
			return isAvailable ? 'light' : 'danger'
		},
		changeAvailable(event) {
			this.newPackage.is_available = !this.newPackage.is_available
		},
		createNewPackage() {
			this.editMode = false
			this.newPackage = {
				name: null,
				description: null,
				start_selling_date: null,
				close_selling_date: null,
				allowed_people: null,
				is_available: true,
				quantity: null,
				price: 0.0,
				itens: []
			}
			this.changeNewItemClicked()
		},
		goToEdit(packageData) {
			this.editMode = true

			const itens = packageData.package_items.map(package_item => {
				return package_item.item
			})

			this.newPackage = {
				id: packageData.id,
				name: packageData.name,
				description: packageData.description,
				start_selling_date: moment(packageData.start_selling_date).format("YYYY-MM-DDTHH:mm"),
				close_selling_date: moment(packageData.end_selling_date).format("YYYY-MM-DDTHH:mm"),
				allowed_people: packageData.allowed_people,
				is_available: packageData.is_available,
				quantity: packageData.quantity,
				price: packageData.price / 100,
				itens: itens
			}

			this.changeNewItemClicked()
		},
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
		createToast(content) {
			this.toasts.push({
				title: 'Sucesso!',
				content
			})
		},
		changeNewItemClicked() {
			this.newItemClicked = !this.newItemClicked
		},
		submit(event) {
			this.editMode ? this.updatePackage(event) : this.createPackage(event)
		},
		updatePackage(event) {
			const formEvent = event.currentTarget
			event.preventDefault()
			event.stopPropagation()

			this.validatedCustom01 = true

			if (formEvent.checkValidity() !== false) {

				const tourId = this.$route.params.id

				this.$apollo.mutate({
					mutation: UPDATE_PACKAGE,
					variables: {
						id: this.newPackage.id,
						name: this.newPackage.name,
						description: this.newPackage.description,
						start_selling_date: this.newPackage.start_selling_date ? new Date(this.newPackage.start_selling_date).toISOString()
							: null,
						close_selling_date: this.newPackage.close_selling_date ? new Date(this.newPackage.close_selling_date) : null,
						quantity: this.newPackage.quantity ? parseInt(this.newPackage.quantity) : null,
						allowed_people: this.newPackage.allowed_people ? parseInt(this.newPackage.allowed_people) : null,
						tour_id: tourId,
						is_available: this.newPackage.is_available,
						price: this.newPackage.price * 100,
					}
				}).then(value => {
					this.createToast("Um pacote foi atualizado")
					this.editMode = false
					this.changeNewItemClicked()
					this.newPackage = {
						name: null,
						description: null,
						start_selling_date: null,
						close_selling_date: null,
						allowed_people: null,
						quantity: null,
						price: 0.0,
						itens: []
					}
					this.$apollo.queries.packages.refetch({
						where: this.where
					})
				}).catch(err => {
					console.log(err)
				})
			}
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
						is_available: this.newPackage.is_available,
						price: this.newPackage.price * 100,
					}
				}).then(value => {
					this.createToast("Um novo pacote foi cadastrado!")
					this.changeNewItemClicked()
					this.newPackage = {
						name: null,
						description: null,
						start_selling_date: null,
						close_selling_date: null,
						allowed_people: null,
						quantity: null,
						price: 0.0,
						itens: []
					}
					this.$apollo.queries.packages.refetch({
						where: this.where
					})
				}).catch(err => {
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

			this.$apollo.queries.packages.refetch({
				where: this.where
			})
		}
	}
}
</script>
