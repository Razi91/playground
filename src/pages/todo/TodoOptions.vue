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
import Vue from 'vue';

type Task = {
  id: number;
  task: string;
  done: string | null
}

const DefaultFilter = {
  hideDone: false
};

export default Vue.extend({
  name: 'TodoOptions',
  data() {
    return {
      list: [] as Task[],
      newTask: '',
      filter: { ...DefaultFilter },
      nextId: 0
    };
  },
  computed: {
    showList() {
      let list = [...this.list] as Task[];
      if (this.filter.hideDone) {
        list = list.filter(item => item.done == null);
      }
      return list.sort((a: Task, b: Task) => {
        if (a.done == b.done) {
          return 0;
        }
        return a.done == null ? -1 : 1;
      });
    }
  },
  methods: {
    addTask() {
      this.list.push({
        id: this.nextId++,
        task: this.newTask,
        done: null
      });
      this.newTask = '';
    },
    switchTask(item: Task) {
      if (item.done == null) {
        item.done = new Date().toDateString();
      } else {
        item.done = null;
      }
    }
  }
});
</script>

<style scoped lang="scss">

</style>
