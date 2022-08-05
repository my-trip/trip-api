<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-0">
            <CCardBody v-if="!registred" class="p-4">
              <CAlert color="primary">Seu cadastro foi concluído!</CAlert>
              <CRow>
                <CCol :xs="6">
                  <router-link :to="'/pages/login'">
                    <CButton @click="login" color="primary" class="px-4">
                      Fazer Login
                    </CButton>
                  </router-link>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardBody v-else class="p-4">
              <h1>Cadastro</h1>
              <AgencyRegisterForm  @register-submit="submit" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AgencyRegisterForm from '@/views/forms/agency/register.vue'
import Auth from '@/mixins/auth'

export default {
  name: 'Register',
  mixins: [Auth],
  components: {
    AgencyRegisterForm,
  },
  data: function () {
    return {
      registred: false
    }
  },
  methods: {
    submit: async function (submitData) {
      try {
        await this.signUp(submitData)  
      } catch (e) {
        this.liveExampleVisible = true
        this.errorMessage = e.message
      }
    }
  }
}
</script>
