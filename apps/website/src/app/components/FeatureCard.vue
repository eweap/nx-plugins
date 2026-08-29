<script setup lang="ts">
defineProps<{
  title: string;
  body: string;
  points: string[];
}>();
</script>

<template>
  <article
    class="rounded-3xl border border-slate-200/70 bg-slate-100/90 p-6 shadow-[0_12px_30px_rgba(148,163,184,0.16)] dark:border-slate-700/40 dark:bg-slate-800/65 dark:shadow-[0_12px_30px_rgba(6,11,24,0.14)]"
  >
    <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
      {{ title }}
    </h3>
    <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
      {{ body }}
    </p>

    <ul
      class="mt-5 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
    >
      <li
        v-for="point in points"
        :key="point"
        class="flex gap-3"
      >
        <span
          class="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500 dark:bg-sky-300"
        />
        <span>{{ point }}</span>
      </li>
    </ul>
  </article>
</template>
