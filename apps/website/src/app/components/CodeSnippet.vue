<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import { computed, ref } from 'vue';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);

const props = withDefaults(
  defineProps<{
    title: string;
    code: string;
    language?: 'bash' | 'json' | 'typescript' | 'ts';
  }>(),
  {
    language: 'bash',
  },
);

const copied = ref(false);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const highlightedCode = computed(() => {
  try {
    return hljs.highlight(props.code, { language: props.language }).value;
  } catch {
    return escapeHtml(props.code);
  }
});

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 1800);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <div
    class="overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50 dark:border-slate-700/40 dark:bg-slate-950"
  >
    <div
      class="flex items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/40"
    >
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
        >
          Code snippet
        </p>
        <p class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
          {{ title }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span
          class="rounded-full border border-slate-200/70 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:border-slate-700/40 dark:bg-slate-800 dark:text-slate-400"
        >
          {{ language }}
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 hover:border-sky-300/70 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700/40 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-300/40 dark:hover:bg-slate-800"
          @click="copyCode"
        >
          <svg
            v-if="copied"
            aria-hidden="true"
            viewBox="0 0 16 16"
            class="h-3.5 w-3.5 text-emerald-500"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.6"
          >
            <path d="M3.5 8.25 6.5 11.25 12.5 4.75" />
          </svg>
          <svg
            v-else
            aria-hidden="true"
            viewBox="0 0 16 16"
            class="h-3.5 w-3.5 text-slate-500 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.3"
          >
            <rect
              x="5"
              y="3.5"
              width="7.5"
              height="9"
              rx="1.5"
            />
            <path d="M3.5 10.5V5.75A1.25 1.25 0 0 1 4.75 4.5H9" />
          </svg>
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </div>

    <pre class="overflow-x-auto text-sm leading-7">
      <code
        class="hljs"
        v-html="highlightedCode"
      />
    </pre>
  </div>
</template>
