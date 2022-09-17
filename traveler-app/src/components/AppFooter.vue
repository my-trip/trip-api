<template>
  <CFooter>
    <div>
      MyTrip
      <!-- <span class="ms-1"
        >&copy; {{ new Date().getFullYear() }} creativeLabs.</span
      > -->
    </div>
    <div class="ms-auto">
      <span class="me-1" target="_blank"></span>
      <span class="ms-1">{{ new Date().toLocaleString('pt-br', {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "numeric"
        })
      }} </span>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>
