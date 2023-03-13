<template>
  <ContentField>
    Register
    <hr>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input v-model="name" type="text" class="form-control" id="name">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="password" aria-describedby="passwordHelp">
            <div id="passwordHelp" class="form-text">Length should be more than 6.</div>
          </div>
          <div class="mb-3">
            <label for="confirmedPassword" class="form-label">Confirmed Password</label>
            <input v-model="confirmedPassword" type="password" class="form-control" id="confirmedPassword" aria-describedby="repeatHelp">
            <div id="repeatHelp" class="form-text">Repeat your password.</div>
          </div>
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
  name: "RegisterIndexView",
  components: {ContentField},
  setup() {
    const store = useStore();
    let name = ref("");
    let password = ref("");
    let confirmedPassword = ref("");
    let msg = ref("")
    const register = () => {
      msg.value = "";
      store.dispatch("register", {
        name: name.value,
        password: password.value,
        confirmedPassword: confirmedPassword.value,
        success() {
          name.value = "";
          password.value = "";
          confirmedPassword.value = "";
          // redirect tio login page
          router.push({name: "user_account_login"})
        },
        error(resp) {
          if (resp.code === "101") {
            msg.value = "Name is used!"
          } else if (resp.code === "102") {
            msg.value = "Two passwords are different!"
          } else if (resp.code === "103") {
            msg.value = "Password too short!"
          } else if (resp.code === "104") {
            msg.value = "104 error!"
          } else {
            msg.value = "Unknown error!"
          }
        }
      });
    }
    return {
      name,
      password,
      confirmedPassword,
      msg,
      register,
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