<script setup lang="ts">
import {
  currentYear,
  packageSourceUrl,
  repositoryUrl,
} from '../utils/docs-content';
</script>

<template>
  <footer
    class="border-t border-slate-200/70 bg-slate-100/90 dark:border-slate-700/40 dark:bg-slate-950/92"
  >
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"
    >
      <div>
        <p class="font-medium text-slate-900 dark:text-slate-100">
          nx-workspace-tools
        </p>
        <p class="mt-1">Static documentation for Nx developers.</p>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <a
          :href="repositoryUrl"
          target="_blank"
          rel="noreferrer"
          class="hover:text-slate-950 dark:hover:text-slate-100"
        >
          Repository
        </a>
        <a
          :href="packageSourceUrl"
          target="_blank"
          rel="noreferrer"
          class="hover:text-slate-950 dark:hover:text-slate-100"
        >
          Package source
        </a>
        <span>© {{ currentYear }} Eweap</span>
      </div>
    </div>
  </footer>
</template>
