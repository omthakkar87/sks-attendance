<template>
  <div class="take">
    <v-container>
      <v-card>
        <v-card-text>
          <h2>Create Session</h2>
          <br />
          <v-select :items="subjects" v-model="subject" label="Subject" return-object></v-select>
          <v-text-field v-model="noOfLect" type="number" label="No. Of Lectures"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="starttaking()">Start</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      subjects: [],
      subject: null,
      noOfLect: null,
      sessionid: null
    };
  },
  methods: {
    checkId(id) {
      firebase
        .database()
        .ref("sessions/" + id)
        .once("value", snapshot => {
          if (snapshot.val() == null) {
            console.log("NULL");
            firebase
              .database()
              .ref("sessions/" + this.sessionid + "/lecture/")
              .set({
                status: "started",
                faculty: firebase.auth().currentUser.uid,
                subject: this.subject.subject,
                noOfLect: this.noOfLect,
                class: this.subject.stream,
                timestamp: Date.now()
              })
              .then(() => {
                this.$router.push("/Session/" + this.sessionid);
              });
            return true;
          } else {
            console.log("INCREMENT");
            this.sessionid = this.sessionid + 1;
            this.checkId(this.sessionid);
          }
        });
    },
    starttaking() {
      this.sessionid = 1;
      for (var i = 0; i < this.subject.text.length; i++) {
        var d = this.subject.text.charCodeAt(i);
        this.sessionid =
          ((this.sessionid *= d) * this.noOfLect * Date.now()) % 9999;
        if (this.sessionid <= 1000) {
          this.sessionid = this.sessionid + (Date.now() % 8999);
        }
      }
      this.checkId(this.sessionid);
    }
  },
  mounted() {
    firebase
      .database()
      .ref("faculties/" + firebase.auth().currentUser.uid)
      .once("value", snapshot => {
        snapshot.forEach(batch => {
          this.subjects.push({
            text: batch.val().batch + " (" + batch.val().subject + ")",
            stream: batch.val().batch,
            subject: batch.val().subject
          });
        });
      });
  }
};
</script>

<style>
</style>