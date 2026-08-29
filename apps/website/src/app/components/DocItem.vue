<script setup lang="ts">
import type { PropType } from 'vue';

import CodeSnippet from './CodeSnippet.vue';

type ApiOption = {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  required?: boolean;
};

type ApiSnippet = {
  title: string;
  language: 'bash' | 'json';
  code: string;
};

defineProps({
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<ApiOption[]>,
    required: true,
  },
  notes: {
    type: Array as PropType<string[]>,
    required: true,
  },
  snippets: {
    type: Array as PropType<ApiSnippet[]>,
    required: true,
  },
});
</script>

<template>
  <article
    class="rounded-3xl border border-slate-200/70 bg-slate-100/90 p-6 dark:border-slate-700/40 dark:bg-slate-800/65"
  >
    <div
      class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"
    >
      <div>
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {{ name }}
          </h3>
          <span
            class="rounded-full border border-slate-200/70 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:border-slate-700/40 dark:bg-slate-900 dark:text-slate-400"
          >
            {{ kind }}
          </span>
        </div>
        <p
          class="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400"
        >
          {{ purpose }}
        </p>
      </div>
    </div>

    <div
      class="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/40"
    >
      <table class="w-full border-collapse text-left text-sm">
        <thead
          class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <tr>
            <th class="px-4 py-3 font-semibold">Option</th>
            <th class="px-4 py-3 font-semibold">Type</th>
            <th class="px-4 py-3 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="option in options"
            :key="option.name"
            class="border-t border-slate-200/70 align-top text-slate-600 dark:border-slate-700/40 dark:text-slate-400"
          >
            <td
              class="px-4 py-3 font-medium text-slate-900 dark:text-slate-100"
            >
              {{ option.name }}
              <span
                v-if="option.required"
                class="ml-2 text-xs uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300"
              >
                required
              </span>
            </td>
            <td class="px-4 py-3 font-mono text-sm">{{ option.type }}</td>
            <td class="px-4 py-3 leading-7">
              <span>{{ option.description }}</span>
              <span
                v-if="option.defaultValue"
                class="block text-sm text-slate-500 dark:text-slate-400/90"
              >
                Default: {{ option.defaultValue }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6 grid gap-5 xl:grid-cols-2">
      <CodeSnippet
        v-for="snippet in snippets"
        :key="snippet.title"
        :title="snippet.title"
        :language="snippet.language"
        :code="snippet.code"
      />
    </div>

    <ul
      class="mt-6 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-400"
    >
      <li
        v-for="note in notes"
        :key="note"
        class="flex gap-3"
      >
        <span
          class="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500 dark:bg-sky-300"
        />
        <span>{{ note }}</span>
      </li>
    </ul>
  </article>
</template>
