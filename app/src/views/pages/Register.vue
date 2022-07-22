<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-0">
            <CCardBody class="p-4">
              <h1>Cadastro</h1>
              <AgencyRegisterForm />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AgencyRegisterForm from '@/views/forms/agency/register.vue'

export default {
  name: 'Register',
  components: {
    AgencyRegisterForm,
  },
}
</script>
