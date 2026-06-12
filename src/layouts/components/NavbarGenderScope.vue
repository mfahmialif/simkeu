<script setup>
const userData = useCookie("userData")

const jkScope = useCookie("simkeuJkScope", {
  default: () => "semua",
})

const scopeItems = [
  { title: "Semua", value: "semua", icon: "ri-group-line" },
  { title: "Putra", value: "putra", icon: "ri-user-line" },
  { title: "Putri", value: "putri", icon: "ri-user-heart-line" },
]

const isAdmin = computed(() => {
  const roleName = String(userData.value?.role?.name || "").toLowerCase()

  return roleName === "admin" || Number(userData.value?.role_id) === 1
})

const userScopeLabel = computed(() => {
  const jenisKelamin = String(userData.value?.jenis_kelamin || "").toLowerCase()

  if (jenisKelamin.includes("perempuan")) {
    return "Putri"
  }

  return "Putra"
})

const selectedScopeLabel = computed(() => {
  return scopeItems.find(item => item.value === (jkScope.value || "semua"))?.title || "Semua"
})

const setScope = value => {
  const nextScope = value || "semua"

  if (jkScope.value !== nextScope) {
    jkScope.value = nextScope
    window.location.reload()
  }
}
</script>

<template>
  <div class="navbar-gender-scope">
    <VMenu
      v-if="isAdmin"
      location="bottom end"
      offset="8"
    >
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          variant="tonal"
          color="primary"
          size="small"
          class="navbar-gender-scope__button"
        >
          <VIcon
            icon="ri-filter-3-line"
            size="18"
            class="me-1"
          />
          <span class="navbar-gender-scope__label">{{ selectedScopeLabel }}</span>
          <VIcon
            icon="ri-arrow-down-s-line"
            size="18"
            class="ms-1"
          />
        </VBtn>
      </template>

      <VList
        density="compact"
        min-width="150"
      >
        <VListItem
          v-for="item in scopeItems"
          :key="item.value"
          :active="(jkScope || 'semua') === item.value"
          @click="setScope(item.value)"
        >
          <template #prepend>
            <VIcon
              :icon="item.icon"
              size="18"
            />
          </template>
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>

    <VChip
      v-else
      size="small"
      color="primary"
      variant="tonal"
      prepend-icon="ri-filter-3-line"
      class="navbar-gender-scope__chip"
    >
      {{ userScopeLabel }}
    </VChip>
  </div>
</template>

<style lang="scss" scoped>
.navbar-gender-scope {
  display: flex;
  align-items: center;
  min-inline-size: 0;
}

.navbar-gender-scope__button {
  min-inline-size: 96px;
  padding-inline: 10px 8px;
  text-transform: none;
}

.navbar-gender-scope__label {
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
}

.navbar-gender-scope__chip {
  block-size: 32px;
}

@media (max-width: 600px) {
  .navbar-gender-scope__button {
    min-inline-size: 88px;
    padding-inline: 8px 6px;
  }
}
</style>
