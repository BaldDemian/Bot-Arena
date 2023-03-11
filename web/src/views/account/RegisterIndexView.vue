<template>
  <ContentField>
    Register
    <hr>
    <div class="row justify-content-md-center">
      <div class="col-3">
        <form>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" aria-describedby="passwordHelp">
            <div id="passwordHelp" class="form-text">Length should be more than 6.</div>
          </div>
          <div class="mb-3">
            <label for="confirmedPassword" class="form-label">Confirmed Password</label>
            <input type="password" class="form-control" id="confirmedPassword" aria-describedby="repeatHelp">
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
//import {useStore} from "vuex";

export default {
  name: "RegisterIndexView",
  components: {ContentField},
  setup() {
    //const store = useStore();
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