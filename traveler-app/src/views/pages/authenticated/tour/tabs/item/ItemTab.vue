<template>
  <CRow>
    <CCol :md="12">
      <CCard class="mb-4 p-4">
        <CCardBody>
          <CRow>
            <CCol :md="5">
              <CButton :color="newItemColor" @click="changeNewItemClicked">Novo Item</CButton>
            </CCol>
          </CRow>
          <CRow v-if="newItemClicked" class="mt-4">
            <CCol>
              <CCard class="mb-4 p-4">
                <CCardBody>
                  <CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
                    @submit="createItem">
                    <CRow>
                      <CCol :md="12">
                        <CFormLabel>Nome</CFormLabel>
                        <CFormInput required v-model="newItem.name" id="newItemName" type="text" />
                      </CCol>
                    </CRow>
                    <CRow class="mt-2">
                      <CCol :md="12">
                        <CFormLabel>Descrição</CFormLabel>
                        <CFormTextarea v-model="newItem.description" id="newItemDescription" label="Example textarea"
                          rows="3">
                        </CFormTextarea>
                      </CCol>
                    </CRow>
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
              </CTableRow>
            </CTableHead>
            <CTableBody v-for="itemData in item" :key="itemData.id">
              <CTableRow>
                <CTableDataCell class="text-center" scope="row">{{ itemData.name }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ itemData.description || "-" }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <div class="pt-5" v-else>
            <p class="text-medium-emphasis text-center">Não há itens cadastrados</p>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>


<script>
import { GET_ITEM } from '../../../../../../graphql/queries/item/getItem.js'
import { NEW_ITEM } from '../../../../../../graphql/mutations/item/InsetItem.js'

export default {
  name: 'ItemTab',
  data: function () {
    return {
      item: [],
      where: {},
      newItemClicked: false,
      newItem: {
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
    createToast() {
      this.toasts.push({
        title: 'Sucesso!',
        content: 'Um novo item foi cadastrado.'
      })
    },
    changeNewItemClicked() {
      this.newItemClicked = !this.newItemClicked
    },
    createItem(event) {
      const formEvent = event.currentTarget
      event.preventDefault()
      event.stopPropagation()

      this.validatedCustom01 = true

      if (formEvent.checkValidity() !== false) {
        const tourId = this.$route.params.id
        this.$apollo.mutate({
          mutation: NEW_ITEM,
          variables: {
            name: this.newItem.name,
            description: this.newItem.description,
            tour_id: tourId
          }
        }).then(value => {
          this.createToast()
          this.changeNewItemClicked()
          this.$apollo.queries.item.refetch()

          this.newItem = {
            name: null,
            description: null
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
