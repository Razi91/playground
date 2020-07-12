<template lang="pug">
  div
    q-card(
      v-for="(group) in groups"
      :key="group.label"
    )
      q-card-section
        .text-h6
          q-icon(v-if="group.icon" :name="group.icon")
          | {{group.header}}
      q-separator
      q-card-section(v-if="group.fields")
        template(v-for="field in group.fields")
          component(
            v-bind="attributesFor(field)"
            :label="field.label"
            :value="value[field.fieldName]"
            @input="$v => update(field, $v)"
          )
</template>
<script lang="ts">
/* eslint "@typescript-eslint/no-unsafe-member-access": 0 */
/* eslint "@typescript-eslint/no-unsafe-assignment": 0 */
import { defineComponent, PropType } from '@vue/composition-api';
import { FormField, FormGroup } from 'pages/Form/FormTypes';
import {
  QInput, QSelect
} from 'quasar';
import DatePicker from 'pages/Form/fields/DatePicker.vue';

/*
Wiem że nieoptymalne, jest to przeniesiony mechanizm dynamicznych formularzy z innego projektu pisanego pod Vuetify.
Potrzebny kompilator formularzy do formy stałej (ze stałymi atrybutami)
 */

function attributesFor(field: FormField<unknown>) {
  switch (field.type) {
    case 'text':
      return {
        is: QInput,
        counter: field.counter,
        ...field.params
      };
    case 'number':
      return {
        is: QInput,
        type: 'number',
        ...field.params
      };
    case 'select':
      return {
        is: QSelect,
        // wyłączenie eslinta dla tej linii, jakiś błąd w konfiguracji typescript
        options: 'options' in field ? field.options : [], // eslint-disable-line
        ...field.params
      };
    case 'date':
      return {
        is: DatePicker,
        mask: field.mask,
        ...field.params
      };
  }
  return {
    is: QInput,
  };
}

export default defineComponent({
  name: 'FormComponent',
  props: {
    groups: Array as PropType<FormGroup<unknown>[]>,
    value: Object
  },
  setup(props, ctx) {
    return {
      attributesFor,
      update(field: FormField<unknown>, value: unknown) {
        if ('fieldName' in field && field.fieldName != null) {
          const fieldName = field.fieldName as unknown as string;
          ctx.emit('input', {
            ...props.value,
            // v: value
            [fieldName]: value
          });
        }
      }
    };
  }
});
</script>

<style scoped lang="scss">

</style>
