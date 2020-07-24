<template lang="pug">
  q-page(padding)
    FormComponent(
      :groups="form"
      v-model="item"
    )
    q-card.q-mt-md
      q-card-section
        pre {{item}}
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import FormComponent from './Form/FormComponent.vue';
import { FormGroup } from './Form/FormTypes';

type Entity = {
  name: string;
  count: number;
  created: string;
  fruit: string;
}

export default defineComponent({
  name: 'FormView',
  components: {
    FormComponent
  },
  setup() {
    const item = ref<Entity>({
      name: 'Foo',
      count: 1,
      created: '2020-07-01',
      fruit: 'apple'
    });
    const form: FormGroup<Entity>[] = [
      {
        header: 'Form',
        icon: 'warning',
        fields: [{
          type: 'text',
          label: 'Name',
          fieldName: 'name',
          counter: true,
        },{
          type: 'number',
          label: 'Count',
          fieldName: 'count'
        },{
          type: 'date',
          label: 'Created',
          fieldName: 'created'
        },{
          type: 'select',
          label: 'Fruit',
          fieldName: 'fruit',
          options: ['apple', 'banana', 'orange']
        }]
      }
    ]
    return {
      form,
      item
    };
  }
});
</script>

<style scoped lang="scss">

</style>
