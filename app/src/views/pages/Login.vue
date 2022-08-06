<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit="login">
                  <h1>Bem vindo!</h1>
                  <p class="text-medium-emphasis">Entre na suua conta</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput v-model="email" placeholder="exemplo@email.com" autocomplete="email" />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput v-model="password" type="password" placeholder="Password"
                      autocomplete="current-password" />
                  </CInputGroup>
                  <CAlert color="danger" :visible="liveExampleVisible" dismissible @close="
                    () => {
                      liveExampleVisible = false
                    }
                  ">{{ errorMessage }}</CAlert>
                  <CRow>
                    <CCol :xs="6">
                      <CButton @click="login" color="primary" class="px-4">
                        Entrar
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>MyTrip</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                  </p>
                  <CButton color="light" variant="outline" class="mt-3">
                    Cadastre-se
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import Auth from '@/mixins/auth'

export default {
  name: 'Login',
  mixins: [Auth],
  data: function () {
    return {
      email: '',
      password: '',
      errorMessage: '',
      liveExampleVisible: false,
    }
  },
  methods: {
    async login(event) {
      try {
        event.preventDefault()
        event.stopPropagation()

        await this.signIn({ email: this.email, password: this.password })

        const redirect = this.$route.query.redirect || "dashboard"

        this.$router.push({ path: redirect })
      } catch (e) {
        console.log(e)
        this.liveExampleVisible = true
        this.errorMessage = e.message
      }
    },
  },
}
</script>
