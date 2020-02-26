<template>
  <div class="signup">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-stepper class="grey darken-3" vertical v-model="steps">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Create Account</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-stepper-step :complete="steps > 1" step="1">Create An Account</v-stepper-step>
              <v-stepper-content step="1">
                <v-form @submit.prevent="signupFaculty">
                  <v-text-field
                    v-model="name"
                    prepend-icon="mdi-account"
                    name="Name"
                    :rules="[rules.required]"
                    label="Name"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="collegeid"
                    prepend-icon="mdi-clipboard-account"
                    name="CollegeID"
                    label="College ID"
                    type="text"
                    :rules="[rules.required]"
                    v-mask="mask"
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    prepend-icon="mdi-email"
                    name="Email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    id="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="Password"
                    label="Password"
                    v-model="password"
                    :rules="[rules.required, rules.counter]"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    id="password2"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    name="ConfirmPassword"
                    label="Confirm Password"
                    v-model="password2"
                    :rules="[rules.required, passwordConfirmationRule]"
                    @click:append="show2 = !show2"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      :disabled="disabled"
                      :loading="loading"
                      type="submit"
                    >Create</v-btn>
                  </v-card-actions>
                </v-form>
              </v-stepper-content>
              <v-stepper-step :complete="steps > 2" step="2">Add Courses & Subject Details</v-stepper-step>
              <v-stepper-content step="2">
                <v-form @submit.prevent="signup">
                  <v-select
                    :items="courses"
                    v-model="course"
                    name="Course"
                    label="Course"
                    prepend-icon="mdi-book-multiple"
                    id="Course"
                    :rules="[rules.required]"
                    @change="selectedCourseSubjects"
                  ></v-select>
                  <v-select
                    :items="years"
                    v-model="year"
                    name="Year"
                    prepend-icon="mdi-book-open"
                    label="Year"
                    id="Year"
                    :rules="[rules.required]"
                    @change="selectedCourseSubjects"
                  ></v-select>

                  <v-select
                    :items="semesters"
                    v-model="semester"
                    name="Semester"
                    prepend-icon="mdi-book-open"
                    label="Semester"
                    id="Semester"
                    :rules="[rules.required]"
                    @change="selectedCourseSubjects"
                  ></v-select>
                  <v-select
                    :items="divisions"
                    v-model="division"
                    name="Division"
                    label="Division"
                    prepend-icon="mdi-alphabetical"
                    :rules="[rules.required]"
                    id="Division"
                  ></v-select>
                  <v-select
                    :items="subjects"
                    v-model="subject"
                    name="Subject"
                    prepend-icon="mdi-book"
                    :rules="[rules.required]"
                    label="Subject"
                    id="Subject"
                  ></v-select>
                  <v-row class="text-right mx-5">
                    <v-col>
                      <v-btn fab x-small color="primary" @click="addSubjects">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-center">Course</th>
                          <th class="text-center">Subject</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(addedSub,index) in addedSubs" :key="index">
                          <td class="text-center">{{addedSub.batch}}</td>
                          <td class="text-center">{{addedSub.subject}}</td>
                          <td>
                            <v-btn small text fab @click="RemoveSubject(addedSub,index)">
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      :disabled="disabled"
                      :loading="loading"
                      type="submit"
                    >Sign Up</v-btn>
                  </v-card-actions>
                </v-form>
              </v-stepper-content>
            </v-stepper>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>


<script>
import { mask } from "vue-the-mask";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCUTHRJo6tMY96W13Waec1NCNxNLWFsEaY",
  authDomain: "sks-attendance.firebaseapp.com",
  databaseURL: "https://sks-attendance.firebaseio.com",
  projectId: "sks-attendance",
  storageBucket: "sks-attendance.appspot.com",
  messagingSenderId: "515804574384",
  appId: "1:515804574384:web:e9f17c0928a87a1e"
};

var secondFb = firebase.initializeApp(firebaseConfig, "Secondary");
export default {
  directives: {
    mask
  },
  data() {
    return {
      mask: "##########",
      name: "",
      steps: 0,
      show1: false,
      show2: false,
      collegeid: null,
      rollno: null,
      email: "",
      courses: [
        { text: "B. Sc. IT", value: "BSCIT" },
        { text: "B. Sc. CS", value: "BSCCS" },
        { text: "B. A.", value: "BA" }
      ],
      course: "",
      divisions: [
        { text: "A", value: "A" },
        { text: "B", value: "B" },
        { text: "C", value: "C" }
      ],
      division: "",
      years: [
        { text: "First Year (FY)", value: "FY" },
        { text: "Second Year (SY)", value: "SY" },
        { text: "Third Year (TY)", value: "TY" }
      ],
      year: "",
      semesters: [
        { text: "First Year (FY)", value: "FY" },
        { text: "Second Year (SY)", value: "SY" },
        { text: "Third Year (TY)", value: "TY" }
      ],
      semester: "",
      subjects: [
        { text: "Business Intelligence", value: "BI" },
        { text: "IT Service Management", value: "ITSM" },
        { text: "Securtiy In Computing", value: "SIC" }
      ],
      subject: "",
      addedSubs: [],
      disabled: false,
      loading: false,
      password: "",
      password2: "",
      rules: {
        required: value => !!value || "Required.",
        counter: value => value.length >= 7 || "Min 8 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.password2 || "Password must match";
    }
  },
  methods: {
    selectedCourseSubjects() {
      var flag2 = false;
      for (var yr in this.years) {
        if (this.year == this.years[yr].value) {
          this.semesters = this.years[yr].semesters;
          flag2 = true;
        }
      }
      if (!flag2) {
        this.semesters = [];
      }
      var flag3 = false;
      for (var course in this.courses) {
        if (this.course == this.courses[course].value) {
          this.divisions = this.courses[course].divisions;
          flag3 = true;
        }
      }
      if (!flag3) {
        this.divisions = [];
      }
      this.subject = "";
      this.subjects = [];
      var flag = false;
      this.courses.forEach((course, i) => {
        if (this.course && this.course == course.value) {
          for (var year in course.subjects) {
            if (this.year && this.year == year) {
              if (this.courses[i].subjects) {
                for (var sem in course.subjects[year]) {
                  if (this.semester == sem) {
                    this.subjects = course.subjects[this.year][this.semester];
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
    RemoveSubject(item, index) {
      this.addedSubs.splice(index, 1);
    },
    addSubjects() {
      if (
        this.year &&
        this.course &&
        this.division &&
        this.subject &&
        this.semester
      ) {
        var course = this.year + this.course + "-" + this.division;
        var subject = this.subject;
        var semester = this.semester;
        this.addedSubs.push({
          batch: course,
          semester: semester,
          subject: subject
        });
        this.addedSubs = Array.from(
          new Set(this.addedSubs.map(JSON.stringify))
        ).map(JSON.parse);
      } else {
        return 0;
      }
    },
    signupFaculty() {
      this.disabled = true;
      this.loading = true;
      secondFb
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.steps = 2;
          this.disabled = false;
          this.loading = false;
        });
    },
    signoutFaculty() {
      secondFb.auth().signOut();
    },
    signup() {
      this.disabled = true;
      this.loading = true;
      firebase
        .database()
        .ref("faculties/" + secondFb.auth().currentUser.uid)
        .set({
          name: this.name,
          id: this.collegeid,
          subjects: this.addedSubs
        })
        .then(() => {
          firebase
            .database()
            .ref("users/" + secondFb.auth().currentUser.uid)
            .set({
              id: this.collegeid,
              role: "faculty"
            })
            .then(() => {
              this.signoutFaculty();
              this.$router.push("/");
            });
        });
    }
  },
  mounted() {
    firebase
      .database()
      .ref("courses/")
      .once("value", snapshot => {
        this.courses = snapshot.val();
      });
    firebase
      .database()
      .ref("years/")
      .once("value", snapshot => {
        this.years = snapshot.val();
      });
  }
};
</script>

<style>
</style>