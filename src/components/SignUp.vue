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
                    v-model="name"
                    prepend-icon="mdi-account"
                    name="Name"
                    :rules="[rules.required]"
                    label="Name"
                    type="text"
                  ></v-text-field>
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
                    v-model="rollno"
                    prepend-icon="mdi-numeric"
                    name="RollNo"
                    label="Roll No."
                    :rules="[rules.required]"
                    type="text"
                  ></v-text-field>
                  <v-select
                    :items="divisions"
                    v-model="division"
                    prepend-icon="mdi-alphabetical"
                    name="Division"
                    :rules="[rules.required]"
                    label="Division"
                  ></v-select>
                  <v-select
                    :items="courses"
                    v-model="course"
                    prepend-icon="mdi-book-multiple"
                    name="Course"
                    :rules="[rules.required]"
                    label="Course"
                  ></v-select>
                  <v-select
                    :items="years"
                    v-model="year"
                    prepend-icon="mdi-book-open"
                    name="Year"
                    :rules="[rules.required]"
                    label="Year"
                  ></v-select>

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
      name: "",
      show1: false,
      show2: false,
      collegeid: null,
      rollno: null,
      email: "",
      courses: [
        { text: "B. Sc. IT", value: "BSCIT" },
        { text: "B. Sc. CS", value: "BSCCS" },
        { text: "B. A.", value: "BA" }
      ],
      course: "",
      divisions: [
        { text: "A", value: "A" },
        { text: "B", value: "B" },
        { text: "C", value: "C" }
      ],
      division: "",
      years: [
        { text: "First Year (FY)", value: "FY" },
        { text: "Second Year (SY)", value: "SY" },
        { text: "Third Year (TY)", value: "TY" }
      ],
      year: "",
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
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .catch(error => {
              alert(error.code + " : " + error.message);
              this.loading = false;
              this.disabled = false;
            })
            .then(successs => {
              firebase
                .database()
                .ref("users/" + firebase.auth().currentUser.uid)
                .set({
                  role: "student",
                  id: this.collegeid
                })
                .then(() => {
                  firebase
                    .database()
                    .ref(
                      "students/" +
                        this.year +
                        this.course +
                        "-" +
                        this.division +
                        "/" +
                        this.rollno
                    )
                    .update({
                      id: this.collegeid,
                      name: this.name,
                      uid: firebase.auth().currentUser.uid
                    });
                });
            });
        })
        .catch(function(error) {
          // Handle Errors here.
          alert(error.code + " : " + error.message);
          this.loading = false;
          this.disabled = false;
        });
    }
  }
};
</script>

<style>
</style>