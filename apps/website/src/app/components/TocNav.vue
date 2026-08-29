<script setup lang="ts">
import type { PropType } from 'vue';

type TocItem = {
  id: string;
  label: string;
};

defineProps({
  items: {
    type: Array as PropType<TocItem[]>,
    required: true,
  },
  activeId: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <aside class="hidden lg:block lg:w-56 lg:justify-self-end">
    <div class="panel sticky top-24 p-5">
      <p
        class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300"
      >
        On this page
      </p>
      <nav class="mt-4 space-y-2">
        <a
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          class="block rounded-xl px-3 py-2 text-sm transition-colors"
          :class="
            activeId === item.id
              ? 'bg-sky-100 text-slate-950 dark:bg-sky-300/16 dark:text-slate-100'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
          "
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </aside>
</template>
