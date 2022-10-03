<template>
  <CContainer>
    <CRow class="mb-2">
      <CCol>
        <CCard class="p-2">
          <CCardBoard>
            <TourCard v-if="packageData" :tour="packageData.tour" :abstract="true" />
          </CCardBoard>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol>
        <CCard class="p-2">
          <CCardBoard>
            <h6 class="mb-3 mt-2">Reserva de Pacote</h6>
            <PackageCard v-if="packageData" :packageData="packageData" />
          </CCardBoard>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>
<script>

import { PACKAGE_BY_PK } from "../../../../graphql/queries/package/getPackageByPk"
import TourCard from "../../../../components/tour/TourCard.vue"
import PackageCard from "../../../../components/package/PackageCard.vue"

export default {
  name: "TravelerTour",
  data() {
    return {
      tour: null,
    }
  },
  components: {
    TourCard,
    PackageCard
  },
  apollo: {
    packageData: {
      query: PACKAGE_BY_PK,
      variables() {
        const id = this.$route.params.id
        return {
          id
        }
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


.sortable {
  cursor: pointer;
}
</style>