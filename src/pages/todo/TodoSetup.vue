<template lang="pug">
  div
    q-card
      q-card-section
        q-checkbox(
          v-model="filter.hideDone"
          data-test="Todo.hideDone"
          label="Hide done tasks"
        )
      q-list(bordered separator)
        q-item(
          v-for="item in showList"
          :key="item.id"
          data-test="Todo.task"
          data-testid="item.id"
        )
          q-item-section(side)
            q-checkbox(
              :value="item.done != null"
              @input="switchTask(item)"
              data-test="Todo.isDone"
            )
          q-item-section
            q-item-label {{item.task}}
          q-item-section(side top v-if="item.done != null")
            | done: {{item.done}}
        q-item
          q-input(
            data-test="Todo.newTask"
            v-model="newTask"
            label="New task"
            dense
          )
          q-btn(
            data-test="Todo.addTask"
            @click="addTask"
            :disable="newTask.length == 0"
          ) Add
</template>
<script lang="ts">
import { defineComponent, ref, reactive, computed } from '@vue/composition-api';

type Task = {
  id: number;
  task: string;
  done: string | null
}

const DefaultFilter = {
  hideDone: false
};

export default defineComponent({
  name: 'TodoSetup',
  setup() {
    let id = 0;
    const tasks = ref([] as Task[]);
    const filter = reactive({ ...DefaultFilter });
    const newTask = ref('');

    const showList = computed(() => {
      let list = [...tasks.value];
      if (filter.hideDone) {
        list = list.filter(item => item.done == null);
      }
      return list.sort((a: Task, b: Task) => {
        if (a.done == b.done) {
          return 0;
        }
        return a.done == null ? -1 : 1;
      });
    });

    function addTask() {
      tasks.value.push({
        id: id++,
        task: newTask.value,
        done: null
      });
      newTask.value = '';
    }

    function switchTask(item: Task) {
      if (item.done == null) {
        item.done = new Date().toDateString();
      } else {
        item.done = null;
      }
    }

    return {
      showList,
      newTask,
      filter,
      addTask,
      switchTask
    };
  }
});
</script>

<style scoped lang="scss">

</style>
