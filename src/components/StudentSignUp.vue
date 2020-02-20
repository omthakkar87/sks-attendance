<template>
  <div class="signup">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card>
              <v-toolbar dark color="primary">
                <v-toolbar-title>Create Account</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="signup">
                  <v-text-field
                    v-model="collegeid"
                    prepend-icon="mdi-clipboard-account"
                    name="CollegeID"
                    label="College ID"
                    type="text"
                    :rules="[rules.required]"
                    v-mask="mask"
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    prepend-icon="mdi-email"
                    name="Email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    id="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="Password"
                    label="Password"
                    v-model="password"
                    :rules="[rules.required, rules.counter]"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    id="password2"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    name="ConfirmPassword"
                    label="Confirm Password"
                    v-model="password2"
                    :rules="[rules.required, passwordConfirmationRule]"
                    @click:append="show2 = !show2"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      :disabled="disabled"
                      :loading="loading"
                      type="submit"
                    >Sign Up</v-btn>
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
import { mask } from "vue-the-mask";
import firebase from "firebase";
export default {
  directives: {
    mask
  },
  data() {
    return {
      mask: "##########",
      show1: false,
      show2: false,
      collegeid: null,
      email: "",
      disabled: false,
      loading: false,
      password: "",
      password2: "",
      rules: {
        required: value => !!value || "Required.",
        counter: value => value.length >= 8 || "Min 8 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.password2 || "Password must match";
    }
  },
  methods: {
    signup() {
      this.loading = true;
      this.disabled = true;
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then(() => {
              firebase
                .database()
                .ref("users/" + firebase.auth().currentUser.uid)
                .set({
                  id: this.collegeid,
                  role: "student"
                });
              firebase
                .database()
                .ref("students")
                .once("value", snapshot => {
                  snapshot.forEach(classes => {
                    classes.forEach(roll => {
                      if (roll.val().id == this.collegeid) {
                        firebase
                          .database()
                          .ref(
                            "students/" + classes.key + "/" + roll.key + "/uid"
                          )
                          .set(firebase.auth().currentUser.uid)
                          .then(() => {
                            console.log("UID Set In Student Node");
                          });
                      }
                    });
                  });
                });
            })
            .catch(error => {
              console.log(error.log);
              alert(error.message);
              this.loading = false;
              this.disabled = false;
              console.log("create user with email & password error");
            });
        })
        .catch(error => {
          // Handle Errors here.
          console.log(error.log);
          alert(error.message);
          this.loading = false;
          this.disabled = false;
          console.log("setPersistence error");
        });
    }
  },
  mounted() {}
};
</script>

<style>
</style>