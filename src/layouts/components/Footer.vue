<template>
  <div class="h-100 d-flex align-center justify-space-between text-medium-emphasis">
    <!-- 👉 Footer: left content -->
    <div class="d-flex align-center text-base">
      Made With
      <VIcon
        icon="ri-heart-fill"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By <a
        href="https://uiidalwa.ac.id"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >Team IT Banin & Banat UII Dalwa</a>
    </div>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 d-none">
      {{ new Date().getFullYear() }}
      &copy;
    </span>
  </div>
</template>
