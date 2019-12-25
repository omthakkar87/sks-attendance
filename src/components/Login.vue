<template>
  <div class="login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="person"
                    name="Email"
                    label="Email"
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    id="password"
                    :append-icon="show1 ? 'visibility' : 'visibility_off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    v-model="password"
                    hint="At least 8 characters"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-card-actions>
                    <div>
                    <a style="text-decoration:underline;" @click="forgotpassword()">Forgot Password?</a>
                    <br>
                    <router-link :to="{name:'SignUp'}">Create Account</router-link>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="disabled" :loading="loading" type="submit">Login</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show1: false,
      email: "",
      disabled:false,
      loading:false,
      password: "",
      passwordRules: [
        v => !!v || "Password is Required",
        v => v.length >= 8 || "Min 8 characters"
      ],
      emailRules: [
        v => !!v || "E-mail is Required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    forgotpassword(){},
    login() {
      this.loading = true;
      this.disabled = true;
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(error => {
          alert(error.code + " : " + error.message);
          this.loading=false;
      this.disabled = false;
        });
        })
        .catch(function(error) {
          // Handle Errors here.
          alert(error.code + " : " + error.message)
          this.loading=false;
      this.disabled = false;
        });
    }
  },
  mounted() {/*
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
        console.log("No User")
        // User is signed out.
        // ...
      }
    });*/
  }
};
</script>

<style>
</style>