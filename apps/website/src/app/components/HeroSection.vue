<script setup lang="ts">
defineProps<{
  title: string;
  tagline: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  meta: string[];
}>();
</script>

<template>
  <section
    class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] lg:items-center"
  >
    <div class="py-6 sm:py-10">
      <div
        class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-600 dark:border-slate-700/40 dark:bg-slate-900/80 dark:text-sky-300"
      >
        <span class="h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-300" />
        {{ tagline }}
      </div>

      <h1
        class="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl"
      >
        {{ title }}
      </h1>

      <p
        class="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl"
      >
        {{ subtitle }}
      </p>

      <div class="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          :href="primaryHref"
          class="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:bg-sky-300 dark:hover:bg-sky-200"
        >
          {{ primaryLabel }}
        </a>
        <a
          :href="secondaryHref"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center justify-center rounded-full border border-slate-200/70 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 hover:border-sky-300/70 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700/40 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-300/40 dark:hover:bg-slate-800"
        >
          {{ secondaryLabel }}
        </a>
      </div>

      <ul
        class="mt-8 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400"
      >
        <li
          v-for="item in meta"
          :key="item"
          class="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 dark:border-slate-700/40 dark:bg-slate-900/80"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <slot name="aside" />
  </section>
</template>
