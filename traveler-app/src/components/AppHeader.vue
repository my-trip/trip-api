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
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
  </CHeader>
</template>

<script>
import { logo } from '@/assets/brand/logo'

export default {
  name: 'AppHeader',

  data() {
    return {
      canSearch: true,
      timer: null,
    }
  },
  methods: {
    filterChange(event) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(this.search, 1500)
    },
    search() {
      console.log("BUSCANDOOO")
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