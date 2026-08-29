<script setup lang="ts">
defineProps<{
  theme: 'dark' | 'light';
}>();

defineEmits<{
  'toggle-theme': [];
}>();
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/92 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-950/88"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
    >
      <a
        href="#top"
        class="flex min-w-0 items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400"
      >
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-300/70 bg-white text-base tracking-normal text-slate-900 dark:border-sky-300/35 dark:bg-slate-900 dark:text-slate-100"
        >
          Nx
        </span>
        <span class="truncate">nx-workspace-tools</span>
      </a>

      <nav
        class="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-400 lg:flex"
      >
        <a
          href="#features"
          class="hover:text-slate-950 dark:hover:text-slate-100"
          >Features</a
        >
        <a
          href="#getting-started"
          class="hover:text-slate-950 dark:hover:text-slate-100"
          >Getting started</a
        >
        <a
          href="#api-reference"
          class="hover:text-slate-950 dark:hover:text-slate-100"
          >API reference</a
        >
      </nav>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 hover:border-sky-300/70 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700/40 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-sky-300/40 dark:hover:bg-slate-800"
        :aria-pressed="theme === 'dark'"
        @click="$emit('toggle-theme')"
      >
        <span
          class="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
          >Theme</span
        >
        <span>{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
      </button>
    </div>
  </header>
</template>
