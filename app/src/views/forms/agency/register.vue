<template>
  <CForm>
    <p class="text-medium-emphasis">Dados da agência</p>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormInput required placeholder="Nome da agência" autocomplete="nome" />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormTextarea
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
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault1"
        label="CPF"
      />
      <CFormCheck
        inline
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault2"
        label="CNPJ"
        checked
      />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-rectangle" />
      </CInputGroupText>
      <CFormInput required placeholder="###.###.###-##" autocomplete="nome" />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-user" />
      </CInputGroupText>
      <CFormInput required placeholder="Nome do titular" autocomplete="nome" />
    </CInputGroup>
    <p class="text-medium-emphasis">Dados da conta</p>
    <CInputGroup class="mb-3">
      <CInputGroupText>@</CInputGroupText>
      <CFormInput required placeholder="Email" autocomplete="email" />
    </CInputGroup>
    <CInputGroup class="mb-3">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        type="password"
        placeholder="Senha"
        required
        autocomplete="new-password"
      />
    </CInputGroup>
    <CInputGroup class="mb-4">
      <CInputGroupText>
        <CIcon icon="cil-lock-locked" />
      </CInputGroupText>
      <CFormInput
        required
        type="password"
        placeholder="Repita a senha"
        autocomplete="new-password"
      />
    </CInputGroup>
    <div class="d-grid">
      <CButton type="submit" color="primary">Criar conta</CButton>
    </div>
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
          document_type: null,
        },
        user: {
          email: null,
          password: null,
        },
      },
    }
  },
}
</script>
