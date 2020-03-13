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
                <v-form @submit.prevent="login" v-model="disabled">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="mdi-account"
                    name="Email"
                    label="Email"
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    id="password"
                    :append-icon="show1 ? 'mdi-visibility' : 'mdi-visibility-off'"
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
                      <a
                        v-if="!forgotpass"
                        style="text-decoration:underline;"
                        @click="forgotpassword()"
                      >Forgot Password?</a>
                      <br />
                      <router-link :to="{name:'StudentSignUp'}">Create Account</router-link>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      :disabled="!disabled"
                      :loading="loading"
                      type="submit"
                    >Login</v-btn>
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
import firebase from "firebase";
export default {
  data() {
    return {
      show1: false,
      email: "",
      disabled: false,
      loading: false,
      password: "",
      forgotpass: false,
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
    forgotpassword() {
      this.forgotpass = true;
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          alert("Password Reset Link Sent To Your Email Address!!!");
          this.forgotpass = false;
        })
        .catch(error => {
          if (error.code == "auth/invalid-email") {
            alert("Enter The Email Address To Reset Its Password");
          }
          else{
            alert(error.message)
          }
          this.forgotpass = false;
        });
    },
    login() {
      this.loading = true;
      this.disabled = false;
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .catch(error => {
              console.log(error.code);
              alert(error.message);
              this.loading = false;
              this.disabled = true;
            });
        })
        .catch(function(error) {
          console.log(error.code);
          alert(error.message);
          this.loading = false;
          this.disabled = true;
        });
    }
  },
  mounted() {}
};
</script>

<style>
</style>