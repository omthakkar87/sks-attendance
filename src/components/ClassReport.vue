<template>
  <div class="ma-4">
    <h3 class="text-center ma-5">No. Of Lectures : {{total}}</h3>
    <v-data-table
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="roll"
      @click:row="expandRow"
      :mobile-breakpoint="10"
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
                    <th>Subject</th>
                    <th>Attended</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sub, index) in item.subjects" :key="index">
                    <td>{{sub.subject}}</td>
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
    <!-- <v-container v-for="(subjects,ind) in attendance" :key="ind">
      <h1 class="text-center">subject</h1>
      <v-card v-for="(attend, i) in subjects" :key="i" class="ma-3">
        <v-card-title>{{i}}</v-card-title>
        <v-card-text>
          <ul>
            <li
              v-for="(student,index) in attend"
              :key="index"
            >{{student.id + " - " + student.status}}</li>
          </ul>
        </v-card-text>
      </v-card>
    </!-->
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
      subject: "BI",
      classes: "TYBSCIT-A",
      dataitems: [],
      headers: [
        { text: "R.No.", value: "roll" },
        { text: "Student Name", value: "name" },
        { text: "Attended", value: "attended" },
        { text: "Total", value: "total" },
        { text: "%", value: "percentage" }
      ]
    };
  },
  methods: {
    expandRow(item) {
      // would be
      // this.expanded = [item]
      // but if you click an expanded row, you want it to collapse
      this.expanded = item === this.expanded[0] ? [] : [item];
    },
    calculatePercentage(clgid, name) {
      var total = 0;
      var totalgreen = 0;
      var totalblue = 0;
      var subtotal = 0;
      var subtotalgreen = 0;
      var subtotalblue = 0;
      var roll;
      for (var subject in this.attendance) {
        for (var timestamp in this.attendance[subject]) {
          for (var student in this.attendance[subject][timestamp]) {
            if (this.attendance[subject][timestamp][student].id == clgid) {
              var roll = this.attendance[subject][timestamp][student].roll;
              total++;
              if (
                this.attendance[subject][timestamp][student].status == "green"
              ) {
                totalgreen++;
              }
              if (
                this.attendance[subject][timestamp][student].status == "blue"
              ) {
                totalblue = totalblue + 0.5;
              }
            }
            // console.log(this.attendance[subject][timestamp][student])
          }
        }
      }
      var percentage = ((totalgreen + totalblue) / total) * 100;
      this.total = total;
      return {
        id: clgid,
        roll: roll,
        name: name,
        percentage: percentage.toFixed(2),
        attended: totalgreen + totalblue,
        total: total,
        subjects: this.calculateSubjects(clgid)
      };
    },
    calculateSubjects(clgid) {
      var subjects = {};
      for (var subject in this.attendance) {
        var green = 0;
        var blue = 0;
        var percentage = 0;
        var total = 0;
        for (var timestamp in this.attendance[subject]) {
          for (var student in this.attendance[subject][timestamp]) {
            if (this.attendance[subject][timestamp][student].id == clgid) {
              total++;
              if (
                this.attendance[subject][timestamp][student].status == "green"
              ) {
                green++;
              }
              if (
                this.attendance[subject][timestamp][student].status == "blue"
              ) {
                blue = blue + 0.5;
              }
            }
          }
        }
        percentage = ((green + blue) / total) * 100;
        console.log(subject, green, blue, total, percentage);
        subjects[subject] = {
          subject: subject,
          total: total,
          attended: green + blue,
          percentage: percentage
        };
      }
      console.log(subjects);
      return subjects;
    },
    calculate() {
      var stud = [];
      var percentage = [];
      firebase
        .database()
        .ref("students/" + this.classes)
        .once("value", snapshot => {
          snapshot.forEach(student => {
            stud.push({ id: student.val().id, name: student.val().name });
          });
        })
        .then(() => {
          for (var i in stud) {
            percentage.push(this.calculatePercentage(stud[i].id, stud[i].name));
          }
          this.dataitems = percentage;
        });
    },
    getAttendance() {
      var att = {};
      firebase
        .database()
        .ref("attendance/" + this.classes + "/")
        .once("value", snapshot => {
          snapshot.forEach(subject => {
            att[subject.key] = subject.val();
            // subject.forEach(timestamp => {
            //   att[timestamp.key] = timestamp.val();
            // });
          });
        })
        .then(() => {
          this.attendance = att;
        });
    }
  },
  mounted() {
    this.getAttendance();
    this.calculate();
  }
};
</script>

<style>
</style>