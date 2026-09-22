<script setup lang="ts">
import {
  apiEntries,
  deploymentContent,
  faqItems,
  featureItems,
  gettingStartedCode,
  heroContent,
  installationCommand,
  quickLookContent,
  sectionContent,
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
    <HeroSection v-bind="heroContent">
      <template #aside>
        <div class="panel overflow-hidden">
          <div
            class="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-slate-700/40"
          >
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
              >
                {{ quickLookContent.label }}
              </p>
              <p class="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {{ quickLookContent.description }}
              </p>
            </div>
            <span
              class="shrink-0 whitespace-nowrap rounded-full border border-slate-200/70 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700/40 dark:bg-slate-800 dark:text-slate-400"
            >
              {{ quickLookContent.version }}
            </span>
          </div>

          <div class="space-y-4 px-5 py-5">
            <div
              class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            >
              <div
                v-for="stat in quickLookContent.stats"
                :key="stat.label"
                class="rounded-2xl border border-slate-200/70 bg-slate-100 p-4 dark:border-slate-700/40 dark:bg-slate-800/80"
              >
                <p
                  class="text-2xl font-semibold text-slate-900 dark:text-slate-100"
                >
                  {{ stat.value }}
                </p>
                <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {{ stat.label }}
                </p>
              </div>
            </div>

            <CodeSnippet
              title="Core installation command"
              language="bash"
              :code="installationCommand"
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
          v-bind="sectionContent.features"
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
          :eyebrow="sectionContent.installation.eyebrow"
          :title="sectionContent.installation.title"
          :description="sectionContent.installation.description"
        >
          <div
            class="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
          >
            <CodeSnippet
              :title="sectionContent.installation.installTitle"
              language="bash"
              :code="installationCommand"
            />

            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ sectionContent.installation.prerequisitesTitle }}
              </h3>
              <ul
                class="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
              >
                <li
                  v-for="prerequisite in sectionContent.installation
                    .prerequisites"
                  :key="prerequisite"
                >
                  {{ prerequisite }}
                </li>
              </ul>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="getting-started"
          :eyebrow="sectionContent.gettingStarted.eyebrow"
          :title="sectionContent.gettingStarted.title"
          :description="sectionContent.gettingStarted.description"
        >
          <div
            class="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]"
          >
            <CodeSnippet
              :title="sectionContent.gettingStarted.codeTitle"
              language="bash"
              :code="gettingStartedCode"
            />

            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ sectionContent.gettingStarted.summaryTitle }}
              </h3>
              <p
                class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400"
              >
                {{ sectionContent.gettingStarted.summary }}
              </p>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="usage-examples"
          v-bind="sectionContent.usageExamples"
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
          v-bind="sectionContent.apiReference"
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
          v-bind="sectionContent.notes"
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
                    {{ faqItems[0].question }}
                  </dt>
                  <dd class="mt-1">
                    {{ faqItems[0].answer }}
                  </dd>
                </div>
                <div>
                  <dt class="font-semibold text-slate-900 dark:text-slate-100">
                    {{ faqItems[1].question }}
                  </dt>
                  <dd class="mt-1">
                    {{ faqItems[1].answer }}
                  </dd>
                </div>
              </dl>
            </div>

            <div class="panel p-6">
              <h3
                class="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ deploymentContent.title }}
              </h3>
              <p
                class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400"
              >
                {{ deploymentContent.description }}
              </p>
              <CodeSnippet
                class="mt-5"
                :title="deploymentContent.codeTitle"
                language="bash"
                :code="deploymentContent.code"
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
