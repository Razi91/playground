/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import VueCompositionApi from '@vue/composition-api';
import TodoOptions from '../../../src/pages/todo/TodoOptions.vue';
import TodoSetup from '../../../src/pages/todo/TodoSetup.vue';
import * as All from 'quasar';
// import langEn from 'quasar/lang/en-us' // change to any language you wish! => this breaks wallaby :(
const { Quasar, date } = All;

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

describe('Mount Quasar', () => {
  const localVue = createLocalVue();
  localVue.use(VueCompositionApi);
  localVue.use(Quasar, { components }); // , lang: langEn
  function testComponent (Component, name) {
    describe('procedure for ' + name, () => {
      const wrapper = mount(Component, {
        localVue
      });

      it('adds task', async () => {
        expect(wrapper.find('[data-test="Todo.newTask"]').exists()).toBe(true);
        wrapper.find('[data-test="Todo.newTask"]').setValue('Test');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="Todo.addTask"]').exists()).toBe(true);
        wrapper.find('[data-test="Todo.addTask"]').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="Todo.task"]').exists()).toBe(true);
      });
      it('checks task as done', async () => {
        wrapper.find('[data-test="Todo.isDone"]').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="Todo.isDone"]').attributes('aria-checked')).toBe('true')
      });
      it('hides tasks when done', async () => {
        wrapper.find('[data-test="Todo.hideDone"]').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="Todo.task"]').exists()).toBe(false);

      })
    });
  };

  testComponent(TodoOptions, 'options');
  testComponent(TodoSetup, 'setup');

});
