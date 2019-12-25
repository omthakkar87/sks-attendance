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
                    prepend-icon="assignment_ind"
                    name="CollegeID"
                    label="College ID"
                    type="text"
                    mask="## #### ####"
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="email"
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
                  <v-text-field
                    prepend-icon="lock"
                    id="password2"
                    :append-icon="show2 ? 'visibility' : 'visibility_off'"
                    :rules="passwordRules"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm Password"
                    v-model="password2"
                    hint="At least 8 characters"
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
export default {
  data() {
    return {
      show1: false,
      show2: false,
      collegeid: "",
      email: "",
      disabled: false,
      loading: false,
      password: "",
      password2: "",
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
            }).then(successs => {
                firebase.database().ref('users/'+ firebase.auth().currentUser.uid).set({
                    role:"student",
                    id: this.collegeid    
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