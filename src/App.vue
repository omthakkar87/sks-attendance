<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>SKS</span>
        <span class="font-weight-light">Attendance</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon text v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="editProfile">
            <v-list-item-title>{{"Edit Profile"}}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="signOut">
            <v-list-item-title>{{"Sign Out"}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase";
import Home from "./components/Home";
import Login from "./components/Login";
export default {
  name: "App",
  components: {
    Home,
    Login
  },
  data() {
    return {
    };
  },
  methods: {
    signOut() {
      firebase.auth().signOut();
      console.log("Sign Out");
    },
    editProfile() {
      console.log("Edit Profile");
      this.$router.push("/StudentProfile");
    }
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
              this.$router.push("/StudentHome");
            } else if (userdata.role == "faculty") {
              this.$router.push("/FacultyHome");
            } else if (userdata.role == "admin") {
              this.$router.push("/AdminHome");
            } else {
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
