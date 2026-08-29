<script setup lang="ts">
import githubDarkThemeUrl from 'highlight.js/styles/github-dark.css?url';
import githubLightThemeUrl from 'highlight.js/styles/github.css?url';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import DocumentationMain from './components/DocumentationMain.vue';
import { tocItems } from './utils/docs-content';

type ThemeMode = 'dark' | 'light';
const themeStorageKey = 'nx-workspace-tools-theme';
const highlightThemeLinkId = 'hljs-theme';

const theme = ref<ThemeMode>('dark');
const activeSection = ref(tocItems[0].id);

let sectionObserver: IntersectionObserver | null = null;

function applyHighlightTheme(nextTheme: ThemeMode) {
  let themeLink = document.getElementById(
    highlightThemeLinkId,
  ) as HTMLLinkElement | null;

  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.id = highlightThemeLinkId;
    themeLink.rel = 'stylesheet';
    document.head.appendChild(themeLink);
  }

  themeLink.href =
    nextTheme === 'dark' ? githubDarkThemeUrl : githubLightThemeUrl;
}

function setTheme(nextTheme: ThemeMode) {
  theme.value = nextTheme;
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  document.documentElement.style.colorScheme = nextTheme;
  applyHighlightTheme(nextTheme);
  window.localStorage.setItem(themeStorageKey, nextTheme);
}

function toggleTheme() {
  setTheme(theme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
  const storedTheme = window.localStorage.getItem(themeStorageKey);
  setTheme(storedTheme === 'light' ? 'light' : 'dark');

  if (typeof window.IntersectionObserver !== 'function') {
    return;
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (left, right) => right.intersectionRatio - left.intersectionRatio,
        );

      if (visibleEntries[0]?.target.id) {
        activeSection.value = visibleEntries[0].target.id;
      }
    },
    {
      rootMargin: '-18% 0px -55% 0px',
      threshold: [0.15, 0.35, 0.6],
    },
  );

  for (const item of tocItems) {
    const element = document.getElementById(item.id);

    if (element) {
      sectionObserver.observe(element);
    }
  }
});

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
});
</script>

<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <AppHeader
      :theme="theme"
      @toggle-theme="toggleTheme"
    />
    <DocumentationMain :active-section="activeSection" />
    <AppFooter />
  </div>
</template>
