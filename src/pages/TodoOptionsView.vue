<template lang="pug">
  q-page(padding)
    TodoOptions()
</template>
<script lang="ts">
import Vue from 'vue';
import TodoOptions from 'pages/todo/TodoOptions.vue';

export default Vue.extend({
  name: 'TodoOptionsView',
  components: {
    TodoOptions
  }
});
</script>

<style scoped lang="scss">

</style>
