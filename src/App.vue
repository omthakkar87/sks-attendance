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
            <v-icon v-if="(role == '')">mdi-account-circle</v-icon>
            <img
              v-if="(role != '')"
              :src="'https://myaccount.somaiya.edu/Images/Id/' + clgid + '.jpg'"
            />
          </v-avatar>
        </template>
        <v-list>
          <v-list-item v-if="role == 'student'" @click="viewProfile">
            <v-list-item-title>{{"View Profile"}}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="signOut">
            <v-list-item-title>{{"Sign Out"}}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view :role="role" :clgid="clgid"></router-view>
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
      this.role = undefined;
    },
    viewProfile() {
      this.$router.push("/StudentProfile");
    },
    checkAuthRole() {
      if (this.role == "student") {
        this.$router.push("/StudentHome");
      } else if (this.role == "faculty") {
        this.$router.push("/FacultyHome");
      } else if (this.role == "admin") {
        this.$router.push("/AdminHome");
      } else if (this.role == undefined) {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    document.addEventListener("backbutton", ()=>{
      if(this.$route.path == '/StudentHome' || this.$route.path == '/StudentHome' || this.$route.path == '/FacultyHome' || this.$route.path == '/AdminHome' ){
        if(confirm("Do Really Want To Exit???")){
          navigator.app.exitApp()
        }
      }else{
        this.$router.go(-1)
      }
    }, false);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref("users/" + user.uid)
          .once("value", snapshot => {
            this.role = snapshot.val().role;
            this.clgid = snapshot.val().id;
            if (this.role == "student") {
              this.$router.push("/StudentHome");
            } else if (this.role == "faculty") {
              this.$router.push("/FacultyHome");
            } else if (this.role == "admin") {
              this.$router.push("/AdminHome");
            } else if (this.role == undefined) {
              this.$router.push("/");
            }
          });
      } else {
        this.clgid = 0;
        this.role = "";
        this.$router.push("/Login");
      }
    });
  }
};
</script>
