<script setup lang="ts">
import {
  apiEntries,
  featureItems,
  gettingStartedCode,
  tocItems,
  usageExamples,
} from '../utils/docs-content';
import CodeSnippet from './CodeSnippet.vue';
import DocItem from './DocItem.vue';
import FeatureCard from './FeatureCard.vue';
import HeroSection from './HeroSection.vue';
import SectionBlock from './SectionBlock.vue';
import TocNav from './TocNav.vue';

defineProps<{
  activeSection: string;
}>();
</script>

<template>
  <main
    id="top"
    class="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-12"
  >
    <HeroSection
      title="nx-workspace-tools"
      tagline="Nx plugin"
      subtitle="Generate feature library slices and audit internal workspace dependencies inside standard Nx workflows."
      primary-href="#installation"
      primary-label="Install and start"
      secondary-href="https://github.com/eweap/nx-plugins"
      secondary-label="Open repository"
      :meta="['Static', 'Vue + Tailwind', 'GitHub Pages ready']"
    >
      <template #aside>
        <div class="panel overflow-hidden">
          <div
            class="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-slate-700/40"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
              >
                Quick look
              </p>
              <p class="mt-1 text-sm text-slate-900 dark:text-slate-100">
                One generator, one executor, focused on Nx monorepo maintenance.
              </p>
            </div>
            <span
              class="shrink-0 whitespace-nowrap rounded-full border border-slate-200/70 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700/40 dark:bg-slate-800 dark:text-slate-400"
            >
              v0.0.2-7
            </span>
          </div>

          <div class="space-y-4 px-5 py-5">
            <div
              class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            >
              <div
                class="rounded-2xl border border-slate-200/70 bg-slate-100 p-4 dark:border-slate-700/40 dark:bg-slate-800/80"
              >
                <p
                  class="text-2xl font-semibold text-slate-900 dark:text-slate-100"
                >
                  5
                </p>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  library types scaffolded
                </p>
              </div>
              <div
                class="rounded-2xl border border-slate-200/70 bg-slate-100 p-4 dark:border-slate-700/40 dark:bg-slate-800/80"
              >
                <p
                  class="text-2xl font-semibold text-slate-900 dark:text-slate-100"
                >
                  Vue
                </p>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  feature and ui libraries supported
                </p>
              </div>
              <div
                class="rounded-2xl border border-slate-200/70 bg-slate-100 p-4 dark:border-slate-700/40 dark:bg-slate-800/80"
              >
                <p
                  class="text-2xl font-semibold text-slate-900 dark:text-slate-100"
                >
                  0
                </p>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  runtime services required
                </p>
              </div>
            </div>

            <CodeSnippet
              title="Core installation command"
              language="bash"
              :code="'pnpm add -D @eweap/nx-workspace-tools'"
            />
          </div>
        </div>
      </template>
    </HeroSection>

    <div
      class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"
    >
      <div class="space-y-8">
        <SectionBlock
          id="features"
          eyebrow="Package overview"
          title="A small plugin for repetitive Nx work"
          description="Two jobs: scaffold feature slices and audit internal dependencies."
        >
          <div class="grid gap-5 md:grid-cols-2">
            <FeatureCard
              v-for="feature in featureItems"
              :key="feature.title"
              :title="feature.title"
              :body="feature.body"
              :points="feature.points"
            />
          </div>
        </SectionBlock>

        <SectionBlock
          id="installation"
          eyebrow="Setup"
          title="Install the plugin in an Nx workspace"
          description="Examples use pnpm, but the package is a standard Nx plugin dependency."
        >
          <div
            class="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
          >
            <CodeSnippet
              title="Install"
              language="bash"
              :code="'pnpm add -D @eweap/nx-workspace-tools'"
            />

            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                Prerequisites
              </h3>
              <ul
                class="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
              >
                <li>Use it inside an Nx workspace.</li>
                <li>
                  Examples assume a scoped workspace package name such as
                  @acme/workspace.
                </li>
                <li>
                  Generator output relies on the Nx Vue and Nx JS plugins.
                </li>
              </ul>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="getting-started"
          eyebrow="First steps"
          title="Scaffold a feature slice in one command"
          description="Start with the full slice, then narrow it with libTypes if needed."
        >
          <div
            class="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]"
          >
            <CodeSnippet
              title="Minimal flow"
              language="bash"
              :code="gettingStartedCode"
            />

            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                What this produces
              </h3>
              <p
                class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400"
              >
                It creates feature, data-access, ui, types, and util libraries
                under packages/orders. Package names follow the workspace scope,
                for example @acme/orders and @acme/orders-ui.
              </p>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="usage-examples"
          eyebrow="Examples"
          title="Common Nx workflows"
          description="Examples aligned with the current package surface."
        >
          <div class="space-y-5">
            <article
              v-for="example in usageExamples"
              :key="example.title"
              class="panel p-6"
            >
              <div
                class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
              >
                <div class="max-w-2xl">
                  <h3
                    class="text-lg font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {{ example.title }}
                  </h3>
                  <p
                    class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400"
                  >
                    {{ example.summary }}
                  </p>
                </div>
              </div>

              <CodeSnippet
                class="mt-5"
                :title="example.title"
                :language="example.language"
                :code="example.code"
              />
            </article>
          </div>
        </SectionBlock>

        <SectionBlock
          id="api-reference"
          eyebrow="Reference"
          title="Generators and executors"
          description="The public API is small, so the reference stays direct."
        >
          <div class="space-y-5">
            <DocItem
              v-for="entry in apiEntries"
              :key="entry.name"
              :name="entry.name"
              :kind="entry.kind"
              :purpose="entry.purpose"
              :options="entry.options"
              :notes="entry.notes"
              :snippets="entry.snippets"
            />
          </div>
        </SectionBlock>

        <SectionBlock
          id="notes"
          eyebrow="Notes"
          title="Operational tips"
          description="A few deployment and usage details."
        >
          <div class="grid gap-5 md:grid-cols-2">
            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                FAQ
              </h3>
              <dl
                class="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-400"
              >
                <div>
                  <dt class="font-semibold text-slate-900 dark:text-slate-100">
                    Do I need to pass workspacePrefix every time?
                  </dt>
                  <dd class="mt-1">
                    No. It can be inferred from a scoped root package name such
                    as @acme/workspace.
                  </dd>
                </div>
                <div>
                  <dt class="font-semibold text-slate-900 dark:text-slate-100">
                    Can the executor run in report-only mode?
                  </dt>
                  <dd class="mt-1">
                    Yes. Leave write disabled to run in report mode.
                  </dd>
                </div>
              </dl>
            </div>

            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                Deployment note
              </h3>
              <p
                class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400"
              >
                The site is fully static. The Vite build accepts an optional
                base path for GitHub Pages subpath deployments.
              </p>
              <CodeSnippet
                class="mt-5"
                title="GitHub Pages build"
                language="bash"
                :code="'NX_WEBSITE_BASE_PATH=/nx-plugins/ pnpm nx build website'"
              />
            </div>
          </div>
        </SectionBlock>
      </div>

      <TocNav
        :items="tocItems"
        :active-id="activeSection"
      />
    </div>
  </main>
</template>
