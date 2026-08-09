import type { Preview } from '@storybook/vue3';
import { vueRouter } from 'storybook-vue3-router';

import './styles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  decorators: [vueRouter()],
};

export default preview;
