<template>
  <div class="FacultyManage">
    <v-container>
      <v-form>
        <v-select :items="faculties" v-model="faculty" label="Select Faculty" return-object></v-select>
        <v-simple-table v-if="faculty">
          <template v-slot:default>
            <thead>
              <th>Batch</th>
              <th>Subject</th>
              <th>Action</th>
            </thead>
            <tbody>
              <tr v-for="(sub,index) in faculty.subjects" :key="index">
                <td>{{sub.batch}}</td>
                <td>{{sub.subject}}</td>
                <td>
                  <v-btn small text fab @click="removeSubjects(sub.batch,sub.subject,index)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-row class="text-right" v-if="faculty">
          <v-col>
            <v-dialog v-model="dialog" persistent>
              <template v-slot:activator="{ on }">
                <v-btn small v-on="on">Add New</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span>Add Subject</span>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        @change="selectedCourseSubjects"
                        label="Year"
                        :items="years"
                        v-model="year"
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        @change="selectedCourseSubjects"
                        label="Course"
                        :items="courses"
                        v-model="course"
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        label="Division"
                        :items="divisions"
                        v-model="division"
                        @change="selectedCourseSubjects"
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        label="Semester"
                        :items="semesters"
                        v-model="semester"
                        @change="selectedCourseSubjects"
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select label="Subject" :items="subjects" v-model="subject" return-object></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false">Close</v-btn>
                  <v-btn :loading="loading" @click="addSubjects()">Add</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      divisions: [],
      division: {},
      courses: [],
      course: {},
      subjects: [],
      subject: {},
      years: [],
      year: {},
      semesters: [],
      semester: {},
      faculties: [],
      faculty: null,
      dialog: false,
      loading: false
    };
  },
  methods: {
    selectedCourseSubjects() {
      var flag2 = false;
      for(var yr in this.years){
        if(this.years[yr].value == this.year.value){
          this.semesters = this.year.semesters
          flag2 = true
        }
      }
      if(!flag2){
        this.semesters = []
      }
      var flag3 = false;
      for (var course in this.courses) {
        if (this.course.value == this.courses[course].value) {
          this.divisions = this.courses[course].divisions;
          flag3 = true;
        }
      }
      if (!flag3) {
        this.divisions = [];
      }
      this.item = {};
      this.items = [];
      var flag = false;
      this.courses.forEach((course, i) => {
        if (this.course && this.course.value == course.value) {
          for (var year in course.subjects) {
            if (this.year && this.year.value == year) {
              if (this.courses[i].subjects) {
                for (var sem in course.subjects[year]) {
                  if (this.semester.value == sem) {
                    this.subjects = this.courses[i].subjects[this.year.value][
                      sem
                    ];
                    flag = true;
                  }
                }
              }
            }
          }
        }
      });
      if (!flag) {
        this.subjects = [];
      }
    },
    removeSubjects(batch, subject, index) {
      if (
        confirm(
          "Do You Really Want To Delete " + batch + " - " + subject + "???"
        )
      ) {
        this.faculty.subjects.splice(index, 1);
        firebase
          .database()
          .ref("faculties/" + this.faculty.uid + "/subjects/")
          .set(this.faculty.subjects)
          .then(() => {
            alert("ho gaya");
            // this.fetchFaculties();
          });
      }
    },
    fetchFaculties() {
      this.faculties = [];
      firebase
        .database()
        .ref("faculties")
        .once("value", snapshot => {
          snapshot.forEach(faculty => {
            if (faculty.val().subjects) {
              var facsub = [];
              for (var i in faculty.val().subjects) {
                if (faculty.val().subjects == undefined) {
                  //
                } else {
                  facsub.push(faculty.val().subjects[i]);
                }
              }
              this.faculties.push({
                text: faculty.val().name,
                id: faculty.val().id,
                subjects: facsub,
                uid: faculty.key
              });
            } else {
              this.faculties.push({
                text: faculty.val().name,
                id: faculty.val().id,
                subjects: faculty.val().subjects,
                uid: faculty.key
              });
            }
          });
        });
    },
    addSubjects() {
      this.loading = true;
      if (
        this.year.value &&
        this.course.value &&
        this.division.value &&
        this.subject.value
      ) {
        var course =
          this.year.value + this.course.value + "-" + this.division.value;
        var subject = this.subject.value;
        this.faculty.subjects.push({ batch: course,semester: this.semester.value, subject: subject });
        this.faculty.subjects = Array.from(
          new Set(this.faculty.subjects.map(JSON.stringify))
        ).map(JSON.parse);
        firebase
          .database()
          .ref("faculties/" + this.faculty.uid + "/subjects/")
          .set(this.faculty.subjects)
          .then(() => {
            this.dialog = false;
            this.loading = false;
          });
      } else {
        return 0;
      }
      this.subject = {};
      this.division = {};
      this.course = {};
      this.year = {};
      this.semester = {};
    }
  },
  mounted() {
    firebase
      .database()
      .ref("courses")
      .once("value", snapshot => {
        snapshot.forEach(course => {
          this.courses.push(course.val());
        });
      });
    firebase
      .database()
      .ref("years")
      .once("value", snapshot => {
        snapshot.forEach(year => {
          this.years.push({
            text: year.val().text,
            value: year.val().value,
            semesters: year.val().semesters
          });
        });
      });
    this.fetchFaculties();
  }
};
</script>

<style>
</style>