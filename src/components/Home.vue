<template>
  <v-container class="text-center" pa-5>
    <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
  </v-container>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {};
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref("users/" + user.uid)
          .once("value", snapshot => {
            var userdata = snapshot.val();
            if (userdata.role == "student") {
              this.role = "student";
              this.$router.push("/StudentHome");
            } else if (userdata.role == "faculty") {
              this.role = "faculty";
              this.$router.push("/FacultyHome");
            } else if (userdata.role == "admin") {
              this.role = "admin";
              this.$router.push("/AdminHome");
            } else {
              this.role = "home";
              this.$router.push("/Home");
            }
          });
      } else {
        this.$router.push("/Login");
        // User is signed out.
        // ...
      }
    });
  }
};
</script>

<style>
</style>