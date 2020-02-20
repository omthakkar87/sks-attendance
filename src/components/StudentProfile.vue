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
          disabled
        ></v-text-field>
        <v-text-field
          v-model="rollno"
          prepend-icon="mdi-numeric"
          name="RollNo"
          label="Roll No."
          :error-messages="error"
          required
          type="text"
          disabled
        ></v-text-field>
        <v-text-field
          :items="divisions"
          v-model="division"
          prepend-icon="mdi-alphabetical"
          name="Division"
          required
          label="Division"
          disabled
        ></v-text-field>
        <v-text-field
          :items="courses"
          v-model="course"
          prepend-icon="mdi-book-multiple"
          name="Course"
          required
          label="Course"
          disabled
        ></v-text-field>
        <v-text-field
          :items="years"
          v-model="year"
          prepend-icon="mdi-book-open"
          name="Year"
          required
          label="Year"
          disabled
        ></v-text-field>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      course: "",
      division: "",
      year: "",
      name: "",
      rollno: null,
      id: "",
      loading: false,
      error: null
    };
  },
  methods: {},
  mounted() {
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
                  this.name = rollno.val().name;
                  var year = classes.key.substring(0, 2);
                  var coursediv = classes.key.substring(2).split("-");
                  this.year = year;
                  this.course = coursediv[0];
                  this.division = coursediv[1];
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