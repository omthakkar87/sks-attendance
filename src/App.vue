<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title @click="checkAuthRole" class="headline text-uppercase">
        <span class="font-weight-medium">SKS</span>
        <span class="font-weight-light">Attendance</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-avatar color="grey darken-2" v-on="on" size="36">
            <v-icon v-if="(role == 'home')">mdi-account-circle</v-icon>

            <img
              v-if="(role != 'home')"
              :src="'https://myaccount.somaiya.edu/Images/Id/' + clgid + '.jpg'"
            />
          </v-avatar>
        </template>
        <v-list>
          <v-list-item v-if="role == 'student'" @click="viewProfile">
            <v-list-item-actions>
              <v-icon>mdi-account</v-icon>
            </v-list-item-actions>
            <v-list-item-title>{{"View Profile"}}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="signOut">
            <v-list-item-actions>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-actions>
            <v-list-item-title>{{"Sign Out"}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view :clgid="clgid"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase";
export default {
  name: "App",
  data() {
    return {
      role: "home",
      clgid: 0
    };
  },
  methods: {
    signOut() {
      firebase.auth().signOut();
      console.log("Sign Out");
      this.role = "home";
    },
    viewProfile() {
      console.log("View Profile");
      this.$router.push("/StudentProfile");
    },
    checkAuthRole() {
      if (this.role == "student") {
        this.$router.push("/StudentHome");
      } else if (this.role == "faculty") {
        this.$router.push("/FacultyHome");
      } else if (this.role == "admin") {
        this.$router.push("/AdminHome");
      } else {
        this.$router.push("/Home");
      }
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
            this.clgid = userdata.id;
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
      }
    });
  }
};
</script>
