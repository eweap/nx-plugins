<script setup lang="ts">
defineProps<{
  title: string;
  eyebrow?: string;
  description?: string;
}>();
</script>

<template>
  <section class="panel px-6 py-8 sm:px-8 sm:py-10">
    <header class="max-w-3xl">
      <p
        v-if="eyebrow"
        class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300"
      >
        {{ eyebrow }}
      </p>
      <h2
        class="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400"
      >
        {{ description }}
      </p>
    </header>

    <div class="mt-8">
      <slot />
    </div>
  </section>
</template>
