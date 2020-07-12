<template lang="pug">
  q-input(
    :label="label"
    :value="value"
  )
    q-menu
      q-date(
        v-model="date"
        :mask="mask"
      )
</template>
<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';

export default defineComponent({
  name: 'DatePicker',
  props: {
    value: { type: String },
    label: String,
    mask: { type: String, default: 'YYYY-MM-DD' }
  },
  setup(props, ctx) {
    const date = ref(props.value);
    watch(date, (date) => {
      ctx.emit('input', date);
    });
    return {
      date
    };
  }
});
</script>

<style scoped lang="scss">

</style>
