<template>
  <div class="ma-4">
    <h3 class="text-center ma-5">Overall Attendance : {{total}}%</h3>
    <v-data-table
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="subject"
      @click:row="expandRow"
      :mobile-breakpoint="10"
      hide-default-footer
      :items="dataitems"
      :headers="headers"
      :items-per-page="-1"
    >
      <template v-slot:expanded-item="{item,headers}">
        <td :colspan="headers.length">
          <v-card class="ma-3 pa-3" raised>
            <h3 class="text-center">{{item.name}}</h3>
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Attd</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sub, index) in item.timestamps" :key="index">
                    <td>{{sub.date}}</td>
                    <td>{{sub.attended}}</td>
                    <td>{{sub.total}}</td>
                    <td>{{sub.percentage}}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      attendance: {},
      total: 0,
      expanded: [],
      clgid: null,
      name: null,
      classes: null,
      dataitems: [],
      headers: [
        { text: "Subject", value: "subject" },
        { text: "Attd", value: "attended" },
        { text: "Total", value: "total" },
        { text: "%", value: "percentage" }
      ]
    };
  },
  methods: {
    expandRow(item) {
      this.expanded = item === this.expanded[0] ? [] : [item];
    },
    calculatePercentage(subject) {
      var timestamps = {};
      for (var semester in this.attendance) {
        for (var timestamp in this.attendance[semester][subject]) {
          var green = 0;
          var blue = 0;
          var percentage = 0;
          var total = 0;
          for (var student in this.attendance[semester][subject][timestamp]) {
            if (
              this.attendance[semester][subject][timestamp][student].id ==
              this.clgid
            ) {
              total =
                total +
                (parseInt(
                  this.attendance[semester][subject][timestamp][student]
                    .noOfLect
                )
                  ? parseInt(
                      this.attendance[semester][subject][timestamp][student]
                        .noOfLect
                    )
                  : 1);
              if (
                this.attendance[semester][subject][timestamp][student].status ==
                "green"
              ) {
                green =
                  green +
                  (parseInt(
                    this.attendance[semester][subject][timestamp][student]
                      .noOfLect
                  )
                    ? parseInt(
                        this.attendance[semester][subject][timestamp][student]
                          .noOfLect
                      )
                    : 1);
              }
            }
          }

          percentage = ((green + blue) / total) * 100;
          //   console.log(subject, green, blue, total, percentage);
          var ts = new Date(parseInt(timestamp));
          var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ];
          // console.log(ts.getDate().toString() + " " + months[ts.getMonth()] + ", " + ts.getFullYear().toString())
          var times =
            ts.getDate().toString() +
            " " +
            months[ts.getMonth()] +
            ", " +
            ts.getFullYear().toString();
          timestamps[timestamp] = {
            date: times,
            total: total,
            attended: green + blue,
            percentage: percentage.toFixed(2)
          };
        }
        // console.log(timestamps);
        return timestamps;
      }
    },
    calculateSubjects() {
      var subjects = [];
      for (var semester in this.attendance) {
        for (var subject in this.attendance[semester]) {
          var green = 0;
          var blue = 0;
          var percentage = 0;
          var total = 0;
          for (var timestamp in this.attendance[semester][subject]) {
            for (var student in this.attendance[semester][subject][timestamp]) {
              if (
                this.attendance[semester][subject][timestamp][student].id ==
                this.clgid
              ) {
                total =
                  total +
                  (parseInt(
                    this.attendance[semester][subject][timestamp][student]
                      .noOfLect
                  )
                    ? parseInt(
                        this.attendance[semester][subject][timestamp][student]
                          .noOfLect
                      )
                    : 1);
                if (
                  this.attendance[semester][subject][timestamp][student]
                    .status == "green"
                ) {
                  green =
                    green +
                    (parseInt(
                      this.attendance[semester][subject][timestamp][student]
                        .noOfLect
                    )
                      ? parseInt(
                          this.attendance[semester][subject][timestamp][student]
                            .noOfLect
                        )
                      : 1);
                }
              }
            }
          }
          percentage = ((green + blue) / total) * 100;
          // console.log(subject, green, blue, total, percentage);
          subjects.push({
            subject: subject,
            total: total,
            attended: green + blue,
            percentage: percentage.toFixed(2),
            timestamps: this.calculatePercentage(subject)
          });
        }
        var t = 0,
          a = 0,
          p = 0;
        for (var i in subjects) {
          t = t + subjects[i].total;
          a = a + subjects[i].attended;
          p = (a / t) * 100;
        }
        this.total = p.toFixed(2);
      }

      // console.log(subjects);
      return subjects;
    },
    getAttendance() {
      var att = {};
      firebase
        .database()
        .ref("attendance/" + this.classes + "/")
        .once("value", snapshot => {
          snapshot.forEach(semester => {
            att[semester.key] = semester.val();
          });
        })
        .then(() => {
          this.attendance = att;
          this.dataitems = this.calculateSubjects(this.clgid);
          this.timestamps = this.calculatePercentage(this.clgid);
        });
    }
  },
  mounted() {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value", snapshot => {
        this.clgid = snapshot.val().id;
      })
      .then(() => {
        firebase
          .database()
          .ref("students")
          .once("value", snapshot => {
            // console.log(snapshot.val())
            snapshot.forEach(course => {
              course.forEach(rollno => {
                if (rollno.val().id == this.clgid) {
                  this.classes = course.key;
                  this.name = rollno.val().name;
                }
              });
            });
          })
          .then(() => {
            this.getAttendance();
          });
      });
  }
};
</script>

<style>
</style>