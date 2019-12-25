<template>
  <div class="student-home">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6 pa-2>
          <v-card color="primary">
            <v-layout>
              <v-flex xs12 class="text-xs-center">
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
              <v-btn flat @click="codeDialog = true">Enter Code</v-btn>
              <v-dialog v-model="codeDialog" max-width="220px">
                <v-card>
                  <v-card-text class="text-xs-center">
                    <h3>Enter Session Code</h3>
                  </v-card-text>
                  <v-card-text class="text-xs-right">
                    <v-form @submit.prevent="codeDialog=false; mark()">
                      <v-text-field
                        autofocus
                        box
                        label="Session Code"
                        type="text"
                        v-model="code"
                        mask="# # # #"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="codeDialog=false; mark()">Start</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-card color="primary darken-3">
            <v-layout>
              <v-flex xs12 class="text-xs-center">
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
              <v-btn flat @click="studentreport">Generate Report</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "",
      codeDialog: ""
    };
  },
  methods: {
    mark() {
      this.$router.push("/Mark/" + this.code);
    },
    studentreport() {
      this.$router.push("/StudentReport");
    }
  }
};
</script>

<style>
</style>