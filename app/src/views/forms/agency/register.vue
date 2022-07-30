<template>
<CForm
   class="row g-3 needs-validation"
   novalidate
   :validated="validatedCustom01"
   @submit="handleSubmit"
 >
    <p class="text-medium-emphasis">Dados da agência</p>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormInput v-model="form.name" required placeholder="Nome da agência" autocomplete="nome" />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormTextarea
        v-model="form.description"
        id="exampleFormControlTextarea1"
        label="Example textarea"
        rows="3"
        placeholder="Sobre a agência"
        text="Must be 8-20 words long."
      ></CFormTextarea>
    </CInputGroup>
    <p class="text-medium-emphasis">Documento de Identificação</p>
    <CInputGroup class="mb-4">
      <CFormCheck
        inline
        v-model="form.person.cpf"
        type="radio"
        name="flexRadioDefault"
        model-value="CPF"
        id="flexRadioDefault1"
        label="CPF"
      />
      <CFormCheck
        inline
        type="radio"
        v-model="form.person.cnpj"
        name="flexRadioDefault"
        id="flexRadioDefault2"
        model-value="CNPJ"
        label="CNPJ"
      />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-rectangle" />
      </CInputGroupText>
      <CFormInput v-model="form.person.document" required placeholder="Somente os números"  />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormInput v-model="form.person.name" required placeholder="Nome do titular"  />
    </CInputGroup>
    <p class="text-medium-emphasis">Dados da conta</p>
    <CInputGroup class="mb-3">
      <CInputGroupText>@</CInputGroupText>
      <CFormInput v-model="form.user.email" required placeholder="Email" autocomplete="email" />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        v-model="form.user.password"
        type="password"
        placeholder="Senha"
        required
        autocomplete="new-password"
      />
    </CInputGroup>
    <CInputGroup v-if="requiredRepeatPassword" class="mb-4">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        type="password"
        v-model="form.user.confirmatedPassword"
        placeholder="Repita a senha"
        autocomplete="new-password"
        required
      />
    </CInputGroup>
    <CInputGroup v-else class="mb-4">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        type="password"
        v-model="form.user.confirmatedPassword"
        placeholder="Repita a senha"
        autocomplete="new-password"
        :invalid="repeatPasswordValidation"
      />
      <CFormFeedback   invalid> As senhas tem que ser iguais </CFormFeedback>
    </CInputGroup>
  <CCol xs="12">
    <CButton color="primary" type="submit">Cadastrar</CButton>
  </CCol>
</CForm>
</template>

<script>
export default {
  name: 'RegisterForm',
  data: function () {
    return {
      form: {
        name: null,
        description: null,
        person: {
          name: null,
          cpf: true,
          cnpj: false,
          document: null,
        },
        user: {
          email: null,
          password: null,
          confirmatedPassword: null,
        },
      },
      validatedCustom01: null,
      validatedDefault01: null,
      validatedTooltip01: null,
    }
  },
  computed: {

    requiredRepeatPassword: function () {
      const confirmatedPassword = this.form.user.confirmatedPassword
      if (!confirmatedPassword ||confirmatedPassword == "" ) {
        return true  
      }
      return false
    },
    repeatPasswordValidation: function () {
      const confirmatedPassword = this.form.user.confirmatedPassword
      if (confirmatedPassword !== this.form.user.password ) {
        return true  
      }
      return false
    },
  },
  methods: {
    handleSubmit(event) {
      const formEvent = event.currentTarget
      event.preventDefault()
      event.stopPropagation()

      this.validatedCustom01 = true

      if (formEvent.checkValidity() !== false) {
        const form = this.form
        this.$emit('registerSubmit', {
          name: form.name,
          description: form.description,
          person: {
            name: form.person.name,
            document: form.person.document,
            document_type: form.person.cpf ? 'CPF' : 'CNPJ'
          },
          user: {
            email: form.user.email,
            password: form.user.password,
          }
        })
      }
    }
  }
}
</script>
