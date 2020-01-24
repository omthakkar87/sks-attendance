<template>
  <div class="studentProfile">
    <v-container>
      <v-form class="ma-3">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-flex v-on="on">
              <v-text-field
                v-model="id"
                name="id"
                label="College ID"
                id="id"
                prepend-icon="mdi-clipboard-account"
                disabled
              ></v-text-field>
            </v-flex>
          </template>
          <span>To Update ID Contact Admin</span>
        </v-tooltip>
        <v-text-field
          v-model="name"
          prepend-icon="mdi-numeric"
          name="Name"
          label="Name"
          type="text"
        ></v-text-field>
        <v-text-field
          v-model="rollno"
          prepend-icon="mdi-numeric"
          name="RollNo"
          label="Roll No."
          :error-messages="error"
          required
          type="text"
        ></v-text-field>
        <v-select
          :items="divisions"
          v-model="division"
          prepend-icon="mdi-alphabetical"
          name="Division"
          required
          label="Division"
        ></v-select>
        <v-select
          :items="courses"
          v-model="course"
          prepend-icon="mdi-book-multiple"
          name="Course"
          required
          label="Course"
        ></v-select>
        <v-select
          :items="years"
          v-model="year"
          prepend-icon="mdi-book-open"
          name="Year"
          required
          label="Year"
        ></v-select>
        <div class="text-center ma-5">
          <v-btn @click="savechanges" :loading="loading" label="save" color="primary">SAVE CHANGES</v-btn>
        </div>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      courses: [],
      course: "",
      divisions: [],
      division: "",
      years: [],
      year: "",
      name:"",
      oldcourse: "",
      olddivision: "",
      oldyear: "",
      oldname: "",
      rollno: null,
      oldrollno: null,
      id: "",
      loading: false,
      error: null
    };
  },
  methods: {
    savechanges() {
      firebase
        .database()
        .ref(
          "students/" +
            this.year +
            this.course +
            "-" +
            this.division +
            "/" +
            this.rollno +
            "/"
        )
        .once("value", snapshot => {
          if (
            snapshot.val() != null &&
            snapshot.val().uid != firebase.auth().currentUser.uid
          ) {
            this.error = "Roll Number Already Exist Cannot Update!!!";
            return true;
          } else {
            firebase
              .database()
              .ref(
                "students/" +
                  this.oldyear +
                  this.oldcourse +
                  "-" +
                  this.olddivision +
                  "/" +
                  this.oldrollno +
                  "/"
              )
              .remove()
              .then(() => {
                firebase
                  .database()
                  .ref(
                    "students/" +
                      this.year +
                      this.course +
                      "-" +
                      this.division +
                      "/" +
                      this.rollno +
                      "/"
                  )
                  .set({
                    id: this.id,
                    uid: firebase.auth().currentUser.uid,
                    name: this.name
                  }).then(()=>{
                    alert("Successfully Updated!!!");
                    this.$router.push("/")
                  });
                this.oldyear = this.year;
                this.oldcourse = this.course;
                this.olddivision = this.division;
                this.oldrollno = this.rollno;
                this.oldname = this.name;
              });
          }
        });
    }
  },
  mounted() {
    firebase
      .database()
      .ref("courses")
      .once("value", snapshot => {
        snapshot.forEach(course => {
          this.courses.push({
            text: course.val().text,
            value: course.val().class
          });
        });
      });
    firebase
      .database()
      .ref("years")
      .once("value", snapshot => {
        snapshot.forEach(year => {
          this.years.push({
            text: year.val().text,
            value: year.val().year
          });
        });
      });
    firebase
      .database()
      .ref("divisions")
      .once("value", snapshot => {
        snapshot.forEach(division => {
          this.divisions.push({
            text: division.val().text,
            value: division.val().division
          });
        });
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value", snapshot => {
        this.id = snapshot.val().id;
      })
      .then(() => {
        firebase
          .database()
          .ref("students")
          .once("value", snapshot => {
            snapshot.forEach(classes => {
              classes.forEach(rollno => {
                if (rollno.val().id == this.id) {
                  this.rollno = rollno.key;
                  this.name = rollno.val().name
                  this.oldrollno = rollno.key;
                  var year = classes.key.substring(0, 2);
                  var coursediv = classes.key.substring(2).split("-");
                  this.year = year;
                  this.oldyear = year;
                  this.course = coursediv[0];
                  this.division = coursediv[1];
                  this.oldcourse = coursediv[0];
                  this.olddivision = coursediv[1];
                }
              });
            });
          });
      });
  }
};
</script>

<style>
</style>