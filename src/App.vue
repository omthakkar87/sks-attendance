<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>SKS</span>
        <span class="font-weight-light">Attendance</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon flat v-on="on">
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile>
            <v-list-tile-title @click="editProfile">Edit Profile</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            
            <v-list-tile-title @click="signOut">Sign Out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
// index.js or main.js
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader

import Home from "./components/Home";
import Login from "./components/Login";
import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify, {
  theme: {
    primary: "#00bcd4"
  }
});
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
  methods:{
    signOut(){
      firebase.auth().signOut();
      console.log("Sign Out");
    },
    editProfile(){
      console.log("Edit Profile")
      this.$router.push('/StudentProfile');
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
        firebase.database().ref('users/' + uid).once('value',(snapshot)=>{
            var userdata = snapshot.val();
            if(userdata.role == 'student'){
                this.$router.push('/StudentHome');
            }
            else if(userdata.role == 'faculty'){
                this.$router.push('/FacultyHome');
            }
            else if(userdata.role == 'admin'){
                this.$router.push('/AdminHome')
            }
            else {
                this.$router.push('/Home');
            }
        })
      } else {
        this.$router.push('/Login');
        // User is signed out.
        // ...
      }
    });
  }
};
</script>
