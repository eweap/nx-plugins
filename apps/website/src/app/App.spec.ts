import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import App from './App.vue';

describe('App', () => {
  it('renders documentation content', async () => {
    const wrapper = mount(App, {});
    expect(wrapper.text()).toContain('nx-workspace-tools');
    expect(wrapper.text()).toContain('Install the plugin in an Nx workspace');
    expect(wrapper.text()).toContain('feature-libs');
    expect(wrapper.text()).toContain('internal-deps');
  });
});
