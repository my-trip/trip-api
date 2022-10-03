<template>
  <CContainer>
    <h8> {{ packageData.name }} </h8>
    <CRow>
      <p class="text-medium-emphasis"> {{ packageData.description }}</p>
    </CRow>
    <CRow class="mt-2">
      <CCol>
        <font-awesome-icon icon="fa-solid fa-user" />
        <span class="text-medium-emphasis">Até {{ availablePeople }} pessoas</span>
      </CCol>
    </CRow>
    <CRow class="mt-2">
      <CCol>
        <font-awesome-icon icon="fa-solid fa-money-bill" />
        <span class="ml-2 text-medium-emphasis"> R${{ price }}</span>
      </CCol>
    </CRow>
    <CRow class="mt-4">
      <CCol>
        <font-awesome-icon icon="fa-solid fa-list" />
        <h8 class="sortable" @click="chageItemsVisibility"> Itens Inclusos </h8>
        <div v-if="itemsVisibility">
          <CListGroupItem class="mt-2" v-for="packageItem in packageData.package_items" :key="packageItem.id">
            <font-awesome-icon icon="fa-solid fa-check" />
            <span class="ml-2 text-medium-emphasis"> {{ packageItem.item.name }}</span>
          </CListGroupItem>
        </div>
      </CCol>
    </CRow>
    <CRow class="mt-4 mb-2">
      <CCol :sm="12">
        <CButton @click="goToPurchase" color="primary">Reservar</CButton>
      </CCol>
    </CRow>
  </CContainer>

</template>
<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faMoneyBill, faList, faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(faMoneyBill)
library.add(faUser)
library.add(faList)
library.add(faCheck)

export default {
  name: "TourCard",
  props: {
    packageData: {
      type: Object,
    },
  },
  data() {
    return {
      itemsVisibility: false,
    }
  },
  computed: {
    availablePeople() {
      return this.packageData.allowed_people
    },
    price() {
      return parseFloat((this.packageData.price / 100).toFixed(2));
    },
  },
  methods: {
    goToPurchase() {
      this.$router.push({ name: 'Purchase', params: { id: this.packageData.id } })
    },
    chageItemsVisibility() {
      this.itemsVisibility = !this.itemsVisibility
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