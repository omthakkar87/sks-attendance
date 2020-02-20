<template>
  <div class="student-home">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6 pa-2>
          <v-card color="primary">
            <v-layout>
              <v-flex xs12 class="text-center">
                <v-card-title primary-title>
                  <div style="width:100%;">
                    <div class="headline">Mark Attendance</div>
                    <div class="caption">Press The Enter Code Button To Start The Attendance Session</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-card-actions class="pa-2">
              <v-spacer></v-spacer>
              <v-btn text @click="codeDialog = true">Enter Code</v-btn>
              <v-dialog v-model="codeDialog" max-width="320px">
                <v-card>
                  <v-card-text>
                    <v-card-title>Enter Session Code</v-card-title>
                  </v-card-text>
                  <v-card-text>
                    <v-form @submit.prevent="codeDialog=false; checkcode()">
                      <v-text-field
                        filled
                        label="Session Code"
                        type="text"
                        v-model="code"
                        v-mask="mask"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="codeDialog=false; checkcode()">Start</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-card color="primary darken-3">
            <v-layout>
              <v-flex xs12 class="text-center">
                <v-card-title primary-title>
                  <div style="width:100%;">
                    <div class="headline">View Report</div>
                    <div class="caption">Generate Your Personal Attendance Report.</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-card-actions class="pa-2">
              <v-spacer></v-spacer>
              <v-btn text @click="studentreport">Generate Report</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import { mask } from "vue-the-mask";
export default {
  directives: {
    mask
  },
  data() {
    return {
      code: "",
      codeDialog: "",
      mask: "####"
    };
  },
  methods: {
    checkcode() {
      //query database for a session with sessionid
      firebase
        .database()
        .ref("/sessions/" + this.code)
        .once("value", snapshot => {
          if (snapshot.val() == null) {
            alert("Invalid Code Or Session Doesn't Exist");
            console.log("checkcode -> INVALID CODE");
            return false;
          } else {
            console.log("checkcode -> VALID CODE & SESSION EXIST");
            this.$router.push("/Mark/" + this.code);
          }
        });
    },
    studentreport() {
      this.$router.push("/StudentReport");
    }
  }
};
</script>

<style>
</style>