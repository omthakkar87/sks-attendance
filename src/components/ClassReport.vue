<template>
  <div class="ma-3 mt-5 printlight">
    <v-row class="text-center">
      <v-spacer></v-spacer>
      <v-col cols="6">
        <v-btn color="primary" @click="printReport()" >
          <v-icon left>mdi-google-spreadsheet</v-icon>
          <span>Export PDF</span></v-btn>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row class="px-5">
      <v-col>
        <v-select
          :items="subjects"
          @change="getAttendance()"
          class
          label="Select Class"
          v-model="subject"
          return-object
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field class max="100" min="0" v-mask="mask" label="Defaulters %" v-model="cutoff"></v-text-field>
      </v-col>
    </v-row>

    <h3 class="text-center pa-3">No. Of Lectures : {{total}}</h3>
    <v-data-table
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="roll"
      class="mt-3 pt-3"
      @click:row="expandRow"
      hide-default-footer
      :mobile-breakpoint="10"
      :items="getDefaulters"
      :headers="headers"
      :items-per-page="-1"
      ref="report"
    >
      <template v-slot:expanded-item="{item,headers}">
        <td :colspan="headers.length">
          <v-card class="ma-4 pa-5" raised>
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
    <v-text-field v-model="cutoffValue" class="d-none"></v-text-field>
  </div>
</template>

<script>
import firebase from "firebase";
import { mask } from "vue-the-mask";
import { json2excel } from "js2excel";
export default {
  directives: {
    mask
  },
  inject: ["theme"],
  props: ["printData"],
  data() {
    return {
      attendance: {},
      mask: "###",
      total: 0,
      expanded: [],
      cutoff: 100,
      subject: "",
      classes: "",
      dataitems: [],
      subjects: [],
      headers: [
        { text: "R.No.", value: "roll" },
        { text: "Student Name", value: "name" },
        { text: "Attended", value: "attended" },
        { text: "Total", value: "total" },
        { text: "%", value: "percentage" }
      ]
    };
  },
  computed: {
    cutoffValue() {
      if (this.cutoff >= 100) {
        return (this.cutoff = 100);
      } else if (this.cutoff <= 0) {
        return (this.cutoff = 0);
      } else {
        return this.cutoff;
      }
    },
    getDefaulters() {
      if (this.cutoff == null) {
        let filteredDefaulters = this.dataitems.filter(student => {
          return student.percentage < 100;
        });
        return filteredDefaulters;
      } else {
        let filteredDefaulters = this.dataitems.filter(student => {
          return student.percentage < this.cutoff;
        });
        return filteredDefaulters;
      }
    }
  },
  methods: {
    expandRow(item) {
      this.expanded = item === this.expanded[0] ? [] : [item];
    },
    printReport() {
      let data = this.dataitems
      for(var i in data){
        delete data[i].subjects
        delete data[i].id
      }
      try {
        // json2excel({
        //   data,
        //   name: "class-report",
        //   formateDate: "yyyy/mm/dd"
        // });
        this.$emit("printChanged",data)
        this.$emit("classChanged",this.subject)
        this.$router.push("/PrintReport")
      } catch (e) {
        console.error("export error");
      }
    },
    calculatePercentage(clgid, name) {
      var total = 0;
      var totalgreen = 0;
      var totalblue = 0;
      for (var semester in this.attendance) {
        for (var subject in this.attendance[semester]) {
          for (var timestamp in this.attendance[semester][subject]) {
            for (var student in this.attendance[semester][subject][timestamp]) {
              if (
                this.attendance[semester][subject][timestamp][student].id ==
                clgid
              ) {
                var roll = this.attendance[semester][subject][timestamp][
                  student
                ].roll;
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
                  totalgreen =
                    totalgreen +
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
        }
      }
      var percentage = ((totalgreen + totalblue) / total) * 100;
      this.total = total;
      return {
        id: clgid,
        roll: roll,
        name: name,
        percentage: parseInt(percentage.toFixed(2)),
        attended: totalgreen + totalblue,
        total: total,
        subjects: this.calculateSubjects(clgid)
      };
    },
    calculateSubjects(clgid) {
      var subjects = {};
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
                clgid
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
          console.log(subject, green, blue, total, percentage);
          subjects[subject] = {
            subject: subject,
            total: total,
            attended: green + blue,
            percentage: parseInt(percentage.toFixed(2))
          };
        }
      }
      console.log(subjects);
      return subjects;
    },
    calculate() {
      var stud = [];
      var percentage = [];
      firebase
        .database()
        .ref("students/" + this.subject.stream)
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
        .ref("attendance/" + this.subject.stream + "/")
        .once("value", snapshot => {
          snapshot.forEach(subject => {
            att[subject.key] = subject.val();
          });
        })
        .then(() => {
          this.attendance = att;
          this.calculate();

          this.total = 0;
        });
    }
  },
  mounted() {
    firebase
      .database()
      .ref("faculties/" + firebase.auth().currentUser.uid + "/subjects")
      .once("value", snapshot => {
        snapshot.forEach(batch => {
          this.subjects.push({
            text: batch.val().batch,
            stream: batch.val().batch,
            subject: batch.val().subject,
            semester: batch.val().semester
          });
        });
      })
      .then(() => {
        this.getAttendance();
      });
  }
};
</script>

<style>
</style>