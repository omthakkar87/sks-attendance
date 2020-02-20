<template>
  <div class="edit">
    <div class="edititems" v-if="edittype != 'subjects'">
      <h3 class="text-center ma-5 text-capitalize">Edit {{ edittype }}</h3>
      <v-simple-table class="ma-3">
        <template v-slot:default>
          <thead>
            <th>{{edittype}}</th>
            <th>Value</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in items" :key="index">
              <td>{{item.text}}</td>
              <td>{{item.value}}</td>
              <td>
                <v-btn small text fab @click="EditDialog(item,index)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small text fab @click="RemoveItem(item,index)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row class="text-right mx-5">
        <v-col>
          <v-btn @click="AddDialog">Add New</v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog2">
        <v-card>
          <v-card-title class="text-center">Add {{edittype}} Item</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="text" label="Text"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="value" label="Value"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog2 = false">Close</v-btn>
            <v-btn @click="AddItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="text-center">Edit {{edittype}} Item</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="text" label="Text"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="value" label="Value"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">Close</v-btn>
            <v-btn @click="EditItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-if="edittype == 'subjects'">
      <h3 class="text-center ma-5 text-capitalize">Edit {{ edittype }}</h3>
      <v-row class="mx-5">
        <v-col>
          <v-select
            :items="courses"
            @change="selectedCourseSubjects"
            v-model="course"
            return-object
          ></v-select>
        </v-col>
        <v-col>
          <v-select :items="years" @change="selectedCourseSubjects" v-model="year" return-object></v-select>
        </v-col>
      </v-row>
      <v-simple-table class="ma-3">
        <template v-slot:default>
          <thead>
            <th>{{edittype}}</th>
            <th>Value</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in items" :key="index">
              <td>{{item.text}}</td>
              <td>{{item.value}}</td>
              <td>
                <v-btn small text fab @click="EditSubjectDialog(item,index)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small text fab @click="RemoveSubject(item,index)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row class="text-right mx-5">
        <v-col>
          <v-btn @click="AddSubjectDialog">Add New</v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog2">
        <v-card>
          <v-card-title class="text-center">Add {{edittype}} Item</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="text" label="Text"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="value" label="Value"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog2 = false">Close</v-btn>
            <v-btn @click="AddSubject">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="text-center">Edit {{edittype}} Item</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="text" label="Text"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="value" label="Value"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">Close</v-btn>
            <v-btn @click="EditSubject">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      edittype: this.$route.params.edittype,
      dialog: false,
      dialog2: false,
      courses: [],
      items: [],
      years: [],
      text: "",
      value: "",
      course: {},
      item: {},
      year: {},
      index: null
    };
  },
  methods: {
    selectedCourseSubjects() {
      this.item = {};
      var flag = false;
      this.courses.forEach((course, i) => {
        if (this.course && this.course.value == course.value) {
          for (var year in course.subjects) {
            if (this.year && this.year.value == year) {
              if (this.courses[i].subjects) {
                this.items = this.courses[i].subjects[this.year.value];
                flag = true;
              }
            }
          }
        }
      });
      if (!flag) {
        this.items = [];
      }
    },
    EditSubjectDialog(item, index) {
      this.text = item.text;
      this.value = item.value;
      this.item = item;
      this.index = index;
      this.dialog = true;
    },
    EditSubject() {
      this.items[this.index].text = this.text;
      this.items[this.index].value = this.value;
      this.course.subjects[this.year.value][this.index].text = this.text;
      this.course.subjects[this.year.value][this.index].value = this.value;
      var courseIndex = -1;
      for (var course in this.courses) {
        if (this.courses[course].value == this.course.value) {
          alert(this.course.value);
          courseIndex = course;
        }
      }
      if (courseIndex >= 0) {
        firebase
          .database()
          .ref(
            "courses/" +
              courseIndex +
              "/" +
              this.edittype +
              "/" +
              this.year.value
          )
          .set(this.items)
          .then(() => {
            // this.item = {};
            alert("set");
            this.selectedCourseSubjects();
            this.dialog = false;
          });
      } else {
        alert("error");
      }
    },
    AddSubjectDialog() {
      this.text = "";
      this.value = "";
      this.item = {};
      this.index = null;
      this.dialog2 = true;
    },
    AddSubject() {
      this.items.push({
        text: this.text,
        value: this.value
      });
      var courseIndex = -1;
      for (var course in this.courses) {
        if (this.courses[course].value == this.course.value) {
          alert(this.course.value);
          courseIndex = course;
        }
      }
      if (courseIndex >= 0) {
        firebase
          .database()
          .ref(
            "courses/" +
              courseIndex +
              "/" +
              this.edittype +
              "/" +
              this.year.value
          )
          .set(this.items)
          .then(() => {
            alert("ho gaya addd");
            this.selectedCourseSubjects();
            this.dialog2 = false;
          });
      } else {
        alert("error adddd");
      }
      console.log(this.items);
    },
    RemoveSubject(item, index) {
      if (
        confirm(
          "Do You Really Want To Remove " +
            item.text +
            " : " +
            item.value +
            " ???"
        )
      ) {
        var courseIndex = -1;
        for (var course in this.courses) {
          if (this.courses[course].value == this.course.value) {
            alert(this.course.value);
            courseIndex = course;
          }
        }
        if (courseIndex >= 0) {
          this.items.splice(index,1)
          firebase
            .database()
            .ref(
              "courses/" +
                courseIndex +
                "/" +
                this.edittype +
                "/" +
                this.year.value
            )
            .set(this.items)
            .then(() => {
              this.selectedCourseSubjects();
              alert("ho gaya remove");
            });
        } else {
          alert("error removeee");
        }
      }
    },
    EditDialog(item, index) {
      this.text = item.text;
      this.value = item.value;
      this.item = item;
      this.index = index;
      this.dialog = true;
    },
    EditItem() {
      this.items[this.index].text = this.text;
      this.items[this.index].value = this.value;
      firebase
        .database()
        .ref(this.edittype)
        .set(this.items)
        .then(() => {
          this.item = {};
          this.index = null;
          this.dialog = false;
        });
    },
    AddDialog() {
      this.text = "";
      this.value = "";
      this.item = {};
      this.index = null;
      this.dialog2 = true;
    },
    AddItem() {
      var flag = false;
      for (var i in this.items) {
        console.log(i);
        if (
          this.text == this.items[i].text ||
          this.value == this.items[i].value
        ) {
          flag = false;
        } else {
          flag = true;
        }
      }
      if (flag) {
        this.items.push({ text: this.text, value: this.value });
        firebase
          .database()
          .ref(this.edittype)
          .set(this.items)
          .then(() => {
            this.item = {};
            this.index = null;
            this.dialog2 = false;
          });
      } else {
        alert("Duplicate Value");
      }
    },
    RemoveItem(item, index) {
      if (
        confirm(
          "Do You Really Want To Remove " +
            item.text +
            " : " +
            item.value +
            " ???"
        )
      ) {
        firebase
          .database()
          .ref(this.edittype + "/" + index)
          .remove();
      }
    }
  },
  mounted() {
    if (this.edittype == "courses" || this.edittype == "subjects") {
      firebase
        .database()
        .ref("courses")
        .on("value", snapshot => {
          console.log(snapshot.val());
          if (this.edittype == "subjects") {
            this.courses = snapshot.val();
          } else {
            this.items = snapshot.val();
          }
        });
    }
    if (this.edittype == "divisions") {
      firebase
        .database()
        .ref("divisions")
        .on("value", snapshot => {
          console.log(snapshot.val());
          this.items = snapshot.val();
        });
    }
    if (this.edittype == "years" || this.edittype == "subjects") {
      firebase
        .database()
        .ref("years")
        .on("value", snapshot => {
          console.log(snapshot.val());
          if (this.edittype == "subjects") {
            this.years = snapshot.val();
          } else {
            this.items = snapshot.val();
          }
        });
    }
  }
};
</script>

<style scoped></style>
