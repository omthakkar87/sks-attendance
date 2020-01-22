<template>
  <v-container>
    <v-container class="d-flex align-end flex-column">
      <v-btn outlined @click="endSession">End Session</v-btn>
    </v-container>
    <h1 class="text-center">{{this.$route.params.sessionid}}</h1>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs3 v-for="(session,index) in sessions" :key="index">
          <v-card @click="mark(session.roll)" class="xs4 ma-1 text-center" :color="session.status">
            <v-card-text>{{session.roll}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import firebase from "firebase";

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item
    };
  }, initialValue);
};

export default {
  data() {
    return {
      status: "yellow",
      class: "TYBSCIT-A",
      subject: "SIC",
      sessions: [
      ]
    };
  },
  methods: {
    endSession() {
      var attendance = convertArrayToObject(this.sessions, "id");
      console.log(attendance);
      firebase
        .database()
        .ref(
          "attendance/" +
            this.class +
            "/" + this.subject + "/" +
            Date.now()
        )
        .set(attendance)
        .then(() => {
          this.$router.push("/FacultyHome");
        });
    },
    mark(roll) {
      var filter = this.sessions.find((item, i) => {
        if (item.roll == roll) {
          if (this.sessions[i].status == "red") {
            this.sessions[i].status = "green";
          } else if (this.sessions[i].status == "green") {
            this.sessions[i].status = "red";
          } else {
            this.sessions[i].status = "red";
          }
        }
      });
    }
  },
  mounted() {
    firebase
      .database()
      .ref("students/" + this.class)
      .once("value", snapshot => {
        snapshot.forEach(student => {
          this.sessions.push({
            roll: student.key,
            id: student.val().id,
            uid: student.val().uid,
            status: "",
            sessionid: this.$route.params.sessionid
          });
        });
      });

    firebase
      .database()
      .ref("sessions/" + this.$route.params.sessionid + "/attendance/")
      .on("value", snapshot => {
        snapshot.forEach(student => {
          var result = this.sessions.find((obj, i) => {
            if (obj.id == student.key) {
              this.sessions[i].status = "blue";
              this.sessions[i].gps = student.val().gps;
            }
          });
          if (student.val().bt) {
            var result = this.sessions.find((obj, i) => {
              if (obj.id == student.key) {
                this.sessions[i].status = "green";
                this.sessions[i].bt = student.val().bt;
              }
            });
          }
          console.log(student.val());
        });
      });
  }
};
</script>

<style>
</style>