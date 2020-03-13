<template>
  <div class="take">
    <v-container>
      <v-card>
        <v-form v-model="valid">
          <v-card-title>Create Session</v-card-title>
          <v-card-text>
            <v-select
              @change="checkTime"
              :items="subjects"
              v-model="subject"
              label="Subject"
              :rules="[requiredRule]"
              return-object
            ></v-select>
            <v-text-field
              @change="checkTime"
              v-mask="mask"
              v-model="noOfLect"
              label="No. Of Lectures"
              :rules="[requiredRule]"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!(valid && validSession && validTime)" @click="starttaking()">Start</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>Unended Sessions</v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <th>Session ID</th>
                <th>Class</th>
                <th>Actions</th>
              </thead>
              <tbody>
                <tr v-for="(session,index) in facSessions" :key="index">
                  <td>{{session.sessionId}}</td>
                  <td>{{session.lecture.class}}</td>
                  <td>
                    <v-btn @click="removeSession(session,index)" fab x-small text>
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
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
      mask: "#",
      subjects: [],
      subject: null,
      noOfLect: null,
      sessionid: null,
      sessions: {},
      validSession: false,
      validTime: false,
      facSessions: [],
      requiredRule: v => !!v || "Required",
      valid: false
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
                semester: this.subject.semester,
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
    checkTime() {
      var flag = false;
      firebase
        .database()
        .ref("attendance/" + this.subject.stream)
        .once("value", snapshot => {
          snapshot.forEach(semester => {
            semester.forEach(subject => {
              if (subject.key == this.subject.subject) {
                subject.forEach(session => {
                  var diff = Date.now() - session.key;
                  if (diff < 1800000) {
                    flag = true;
                  }
                });
              }
            });
          });
        })
        .then(() => {
          if (!flag) {
            this.validTime = true;
          } else {
            this.validTime = false;
          }
        });
    },
    removeSession(session, index) {
      console.table(session, index);
      if (
        confirm(
          "Do You Really Want To Delete " +
            session.sessionId +
            " : " +
            session.lecture.class +
            "???"
        )
      ) {
        firebase
          .database()
          .ref("sessions/" + session.sessionId)
          .set({})
          .then(() => {
            this.checkOpenSessions();
          });
      }
    },
    checkOpenSessions() {
      if (this.facSessions.length == 0) {
        this.validSession = true;
        return true;
      } else {
        return false;
      }
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
      if (this.checkOpenSessions()) {
        this.checkId(this.sessionid);
      } else {
        alert("You Have A Session Already Running On Your Account");
      }
    }
  },
  mounted() {
    firebase
      .database()
      .ref("faculties/" + firebase.auth().currentUser.uid + "/subjects")
      .once("value", snapshot => {
        snapshot.forEach(batch => {
          this.subjects.push({
            text: batch.val().batch + " (" + batch.val().subject + ")",
            stream: batch.val().batch,
            subject: batch.val().subject,
            semester: batch.val().semester
          });
        });
      });
    firebase
      .database()
      .ref("sessions/")
      .on("value", snapshot => {
        this.facSessions = [];
        snapshot.forEach(session => {
          if (
            session.val().lecture.faculty == firebase.auth().currentUser.uid
          ) {
            this.facSessions.push({ ...session.val(), sessionId: session.key });
            var difference = Date.now() - session.val().lecture.timestamp;
            console.log(difference);
            if (difference > 1800000) {
              firebase
                .database()
                .ref("sessions/" + session.key)
                .set({});
            }
          }
        });
        this.checkOpenSessions();
      });
  }
};
</script>

<style>
</style>