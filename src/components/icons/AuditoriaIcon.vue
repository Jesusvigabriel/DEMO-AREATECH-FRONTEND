<template>
  <img
    :src="require('@/assets/icons/auditoria.svg')"
    alt="Auditoría"
    class="auditoria-icon"
  />
</template>

<script>
export default {
  name: 'AuditoriaIcon'
}
</script>

<style scoped>
.auditoria-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
