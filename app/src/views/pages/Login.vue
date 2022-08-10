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
            <div>
              <autocomplete v-model="test" :items="items" />
            </div>
          </CCardGroup>

        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import Auth from '@/mixins/auth'
import autocomplete from 'vue-autocomplete-input-tag'

export default {
  name: 'Login',
  mixins: [Auth],
  components: {
    autocomplete,
  },
  data: function () {
    return {
      email: '',
      password: '',
      errorMessage: '',
      liveExampleVisible: false,
      test: "",
      items: [
        "Banana",
        "Strawberry",
        "Orange",
        "Lemon",
        "Pineapple",
        "Watermelon",
        "Melon",
      ],
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

<style>
input {
  width: 100%;
  border: 1px solid #ccc;
  color: #666;
  border-radius: 10px;
  outline: none;
  padding: 9px 14px;
  box-sizing: border-box;
  font-size: 14px;
}

.vue-autocomplete-input-tag-items {
  border: 1px solid #ccc;
  max-height: 200px;
  margin-top: 8px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  overflow: auto;
}

.vue-autocomplete-input-tag-item {
  padding: 6px 16px;
  color: #4a4a4a;
  max-width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
}

.vue-autocomplete-input-tag-item:hover {
  background-color: #e8e8e8;
}
</style>
