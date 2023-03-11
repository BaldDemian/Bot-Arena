<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-black">
  <div class="container">
    <router-link class="navbar-brand" :to="{name: 'home'}">BotArena</router-link>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link :class="routeName === 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">PK</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="routeName === 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">Record</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="routeName === 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">RankList</router-link>
        </li>
      </ul>

      <!--rightmost menu-->
      <ul class="navbar-nav" v-if="$store.state.user.logged">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{$store.state.user.name}}
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <router-link class="dropdown-item" :to="{name: 'user_bot_index'}">My Bot</router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click.prevent="logout">Log Out</a></li>
          </ul>
        </li>
      </ul>

      <ul class="navbar-nav" v-else>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_login'}" role="button">
            Login
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_register'}" role="button">
            Register
          </router-link>
        </li>
      </ul>

    </div>
  </div>
  </nav>
</template>

<script>
import {useRoute} from "vue-router";
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    let routeName = computed(() => route.name)
    const logout = () => {
      store.dispatch("logout") // no payload
    }
    return {
      routeName,
      logout,
    }
  }
}
</script>

<style scoped>

</style>