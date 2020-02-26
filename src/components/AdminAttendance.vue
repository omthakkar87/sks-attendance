<template>
  <div class="ma-3 mt-5">
    <v-row class="px-5">
      <v-col>
        <v-select
          :items="courses"
          @change="getAttendance()"
          class
          label="Select Course"
          v-model="course"
          return-object
        ></v-select>
        <v-select
          :items="years"
          @change="getAttendance()"
          class
          label="Select Year"
          v-model="year"
          return-object
        ></v-select>
        <v-select
          :items="semesters"
          @change="getAttendance()"
          class
          label="Select Semester"
          v-model="semester"
          return-object
        ></v-select>
        <v-select
          :items="divisions"
          @change="getAttendance()"
          class
          label="Select Division"
          v-model="division"
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
      item-key="name"
      class="mt-3 pt-3"
      @click:row="expandRow"
      hide-default-footer
      :mobile-breakpoint="10"
      :items="getDefaulters"
      :headers="headers"
      :items-per-page="-1"
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
export default {
  directives: {
    mask
  },
  data() {
    return {
      attendance: {},
      attends:{},
      students: {},
      courses: [],
      years: [],
      semesters: [],
      divisions: [],
      subjects: [],
      course: {},
      year: {},
      semester: {},
      division: {},
      subject: {},
      mask: "###",
      total: 0,
      expanded: [],
      cutoff: 100,
      classes: "TYBSCIT-A",
      items: [],
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
    yearCourseDiv() {
      return this.year.value + this.course.value + "-" + this.division.value;
    },
    cutoffValue() {
      if (this.cutoff >= 100) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return (this.cutoff = 100);
      } else if (this.cutoff <= 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return (this.cutoff = 0);
      } else {
        return this.cutoff;
      }
    },
    getDefaulters() {
      if (this.cutoff == null) {
        let filteredDefaulters = this.items.filter(student => {
          return student.percentage < 100;
        });
        return filteredDefaulters;
      } else {
        let filteredDefaulters = this.items.filter(student => {
          return student.percentage < this.cutoff;
        });
        return filteredDefaulters;
      }
    }
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
                if (
                  this.attendance[semester][subject][timestamp][student]
                    .status == "blue"
                ) {
                  totalblue =
                    totalblue +
                    (parseInt(
                      this.attendance[semester][subject][timestamp][student]
                        .noOfLect
                    )
                      ? parseInt(
                          this.attendance[semester][subject][timestamp][student]
                            .noOfLect
                        ) / 2
                      : 0.5);
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
                if (
                  this.attendance[semester][subject][timestamp][student]
                    .status == "blue"
                ) {
                  blue =
                    blue +
                    (parseInt(
                      this.attendance[semester][subject][timestamp][student]
                        .noOfLect
                    )
                      ? parseInt(
                          this.attendance[semester][subject][timestamp][student]
                            .noOfLect
                        ) / 2
                      : 0.5);
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
      firebase
        .database()
        .ref("students")
        .once("value", snapshot => {
          this.students = snapshot.val();
        })
        .then(() => {
            this.items = []
          for (var i in this.students[this.yearCourseDiv]) {
            this.items.push(
              this.calculatePercentage(
                this.students[this.yearCourseDiv][i].id,
                this.students[this.yearCourseDiv][i].name
              )
            );
          }
        });
    },
    getAttendance() {
        var flag2 = false
        for(var yr in this.years){
            if(this.year.value == this.years[yr].value){
                this.semesters = this.year.semesters
                flag2 = true
            }
        }
        if(!flag2){
            this.semesters = []
        }
        var flag = false
        for(var course in this.attends){
            if(course == this.yearCourseDiv){
                this.attendance = this.attends[this.yearCourseDiv];
                flag = true
            }
        }
        if(!flag){
            this.attendance = []
        }
          this.calculate();
    }
  },
  mounted() {
      firebase
        .database()
        .ref("attendance")
        .once("value", snapshot => {
          this.attends = snapshot.val();
        })
        .then(() => {
          this.calculate();
        });
    firebase
      .database()
      .ref("courses")
      .once("value", snapshot => {
        this.courses = snapshot.val();
      });
    firebase
      .database()
      .ref("years")
      .once("value", snapshot => {
        this.years = snapshot.val();
      });
    firebase
      .database()
      .ref("divisions")
      .once("value", snapshot => {
        this.divisions = snapshot.val();
      });
  }
};
</script>

<style>
</style>