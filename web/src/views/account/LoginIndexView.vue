<template>
  <ContentField v-if="!$store.state.user.pulling">
    Login
    <hr>
     <div class="row justify-content-md-center">
       <div class="col-3">
         <form @submit.prevent="login">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input v-model="name" type="text" class="form-control" id="name">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="password">
          </div>

          <!--prompt for err msg-->
          <div class="msg">
            {{msg}}
          </div>

          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
       </div>
     </div>
  </ContentField>
</template>

<script>
import ContentField from "@/components/ContentField.vue";
import {useStore} from "vuex";
import {ref} from "vue";
import router from "@/router";
export default {
  name: "LoginIndexView",
  components: {ContentField},
  setup() {
    const store = useStore();
    let name = ref('');
    let password = ref('');
    let msg = ref('');

    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      store.commit("updateToken", jwt);
      // check if this local jwt is valid
      store.dispatch("getInfo", {
        success() {
          router.push({name: "home"})
          store.commit("updatePulling", false)
        },
        error() {
          store.commit("updatePulling", false)
        }
      })
    } else {
      store.commit("updatePulling", false)
    }

    const login = () => {
      msg.value = "";
      store.dispatch("login", {
        name: name.value,
        password: password.value,
        success() {
          // on success, get info using token
          // and jump to home page
          store.dispatch("getInfo", {
            success() {
              router.push({name: "home"});
              //console.log(store.state.user)
            },
          })
        },
        error(resp) {
          console.log(resp)
          msg.value = "Wrong user name or password"
        },
      })
    };
    return {
      name,
      password,
      msg,
      login,
    }
  },
}
</script>

<style scoped>
button {
  width: 100%;
}
div.msg {
  color: red;
}
</style>