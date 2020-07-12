<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list padding>
        <q-item
          v-for="link in views"
          :key="link.path"
          clickable
          v-ripple
          :to="link.path"
        >
          <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
          <q-item-section><q-item-label>{{link.name}}</q-item-label></q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',

  components: {
  },

  data () {
    return {
      leftDrawerOpen: false,
      views: [
        {name: 'Todo Options API', path: '/todo1', icon: 'done'},
        {name: 'Todo Setup API', path: '/todo2', icon: 'done'},
        {name: 'Spring sim', path: '/spring', icon: 'toys'},
        {name: 'Form', path: '/form', icon: 'edit'}
      ]
    }
  }
}
</script>
