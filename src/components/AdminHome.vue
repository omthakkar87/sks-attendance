<template>
  <div class="student-home">
    <!-- <v-btn :to="{name:'AdminAttendance'}">ADMIN ATT</v-btn> -->
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm6 pa-2>
          <v-card color="primary lighten-1">
            <v-layout>
              <v-flex xs12 class="text-center">
                <v-card-title primary-title>
                  <div style="width:100%;">
                    <div class="headline">Manage Faculty</div>
                    <div class="caption">Create, Edit, Delete Faculty Accounts And Subjects</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-card-actions class="pa-2">
              <v-spacer></v-spacer>
              <v-btn text :to="{ name: 'FacultySignUp' }">Sign Up</v-btn>
              <v-btn text :to="{ name: 'FacultyManage' }">Manage</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 pa-2>
          <v-card color="primary darken-1">
            <v-layout>
              <v-flex xs12 class="text-center">
                <v-card-title primary-title>
                  <div style="width:100%;">
                    <div class="headline">Manage Courses</div>
                    <div class="caption">Create, Edit, Delete Course Related Parameters</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
                  <v-btn text @click="edit('courses')">Courses</v-btn>
                  <v-btn text @click="edit('divisions')">Divisions</v-btn>
                  <v-btn text @click="edit('subjects')">Subjects</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex><v-flex xs12 sm6 pa-2>
          <v-card color="primary darken-4">
            <v-layout>
              <v-flex xs12 class="text-center">
                <v-card-title primary-title>
                  <div style="width:100%;">
                    <div class="headline">Manage Semesters</div>
                    <div class="caption">Create, Edit, Delete Semesters Related Parameters</div>
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
                  <v-btn text @click="edit('years')">Years</v-btn>
                  <v-btn text @click="edit('semesters')">Semesters</v-btn>
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
    return {};
  },
  methods: {
    edit(edittype) {
      this.$router.push("/Edit/" + edittype);
    }
  }
};
</script>

<style></style>
