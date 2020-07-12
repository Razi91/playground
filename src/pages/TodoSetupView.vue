<template lang="pug">
  q-page(padding)
    TodoSetup()
</template>
<script lang="ts">
import { defineComponent, } from '@vue/composition-api';
import TodoSetup from 'pages/todo/TodoSetup.vue';

export default defineComponent({
  name: 'TodoSetupView',
  components: {
    TodoSetup
  }
});
</script>

<style scoped lang="scss">

</style>
