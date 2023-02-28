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
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            hpy
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <router-link class="dropdown-item" :to="{name: 'user_bot_index'}">My Bot</router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Log Out</a></li>
          </ul>
        </li>
      </ul>

    </div>
  </div>
  </nav>
</template>

<script>
import {useRoute} from "vue-router";
import {computed} from "vue"; // real-time compute
export default {
  setup() { // this function will be called when this page is set up
    const route = useRoute() // get current route and highlight it
    let routeName = computed(() => route.name)
    return {
      routeName
    }
  }
}
</script>

<style scoped>

</style>