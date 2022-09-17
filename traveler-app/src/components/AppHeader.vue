<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <!-- <CHeaderBrand class="mx-auto d-lg-none" to="/">
        <CIcon :icon="logo" height="48" alt="Logo" />
      </CHeaderBrand> -->
      <CHeaderNav class="d-flex me-auto">
        <CContainer>
          <CRow>
            <CColumn>
              <CRow>
                <h6 class="mt-2 sortable" href="#" @click="visibleFilters = !visibleFilters">Filtros</h6>
              </CRow>
              <CRow v-if="visibleFilters">
                <h6 class="mt-4 sortable" @click="visibleGeralFilters = !visibleGeralFilters">Geral</h6>
                <CCol md="6" v-if="visibleGeralFilters">
                  <CFormLabel class="sortable">Pessoas por Pacote</CFormLabel>
                  <CFormInput id="newItemName" type="number" />
                </CCol>
                <CCol md="6" v-if="visibleGeralFilters">
                  <CFormLabel>Embarque a Partir De</CFormLabel>
                  <CFormInput id="exampleFormControlInput1" type="datetime-local" />
                </CCol>
              </CRow>
              <CRow v-if="visibleFilters" class="mt-4">
                <h6 class="mt-2 sortable"  @click="visibleBoardingFilters = !visibleBoardingFilters">Origem</h6>
                <AdressForm v-if="visibleBoardingFilters" :isBoarding="true" />
              </CRow>
              <CRow v-if="visibleFilters" class="mt-4 mb-4">
                <h6 class="mt-2 sortable" @click="visibleDestinyFilters = !visibleDestinyFilters">Destino</h6>
                <AdressForm v-if="visibleDestinyFilters" :isBoarding="true" />
              </CRow>

            </CColumn>
          </CRow>
        </CContainer>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import { logo } from '@/assets/brand/logo'
import AdressForm from '../views/forms/address/Address.vue'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AdressForm
  },
  data() {
    return {
      visibleGeralFilters: true,
      visibleBoardingFilters: false,
      visibleDestinyFilters: false,
      visibleFilters: false
    }
  },
  setup() {
    return {
      logo,
    }
  },
}
</script>

<style>
  .sortable {
    cursor: pointer;
}
</style>