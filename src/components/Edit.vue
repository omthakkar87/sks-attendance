<template>
  <div class="edit">
    <div
      class="edititems"
      v-if="
        edittype != 'subjects' &&
          edittype != 'semesters' &&
          edittype != 'divisions'
      "
    >
      <h3 class="text-center ma-5 text-capitalize">Edit {{ edittype }}</h3>
      <v-simple-table class="ma-3">
        <template v-slot:default>
          <thead>
            <th>{{ edittype }}</th>
            <th>Value</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ item.text }}</td>
              <td>{{ item.value }}</td>
              <td>
                <v-btn small text fab @click="EditDialog(item, index)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small text fab @click="RemoveItem(item, index)">
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
          <v-card-title class="text-center"
            >Add {{ edittype }} Item</v-card-title
          >
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
          <v-card-title class="text-center"
            >Edit {{ edittype }} Item</v-card-title
          >
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
            label="Course"
            return-object
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            :items="years"
            @change="selectedCourseSubjects"
            label="Year"
            v-model="year"
            return-object
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            :items="semesters"
            @change="selectedCourseSubjects"
            v-model="semester"
            label="Semester"
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-simple-table v-if="semester && year && course" class="ma-3">
        <template v-slot:default>
          <thead>
            <th>{{ edittype }}</th>
            <th>Value</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ item.text }}</td>
              <td>{{ item.value }}</td>
              <td>
                <v-btn small text fab @click="EditSubjectDialog(item, index)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small text fab @click="RemoveSubject(item, index)">
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
          <v-card-title class="text-center">
            Add {{ edittype }} Item
          </v-card-title>
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
          <v-card-title class="text-center">
            Edit {{ edittype }} Item
          </v-card-title>
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
    <div v-if="edittype == 'semesters'">
      <h3 class="text-center ma-5 text-capitalize">Edit {{ edittype }}</h3>
      <v-row class="mx-5">
        <v-col>
          <v-select
            :items="years"
            @change="selectedyear"
            v-model="year"
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-simple-table class="ma-3">
        <template v-slot:default>
          <thead>
            <th>{{ edittype }}</th>
            <th>Value</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ item.text }}</td>
              <td>{{ item.value }}</td>
              <td>
                <v-btn small text fab @click="EditSemesterDialog(item, index)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small text fab @click="RemoveSemester(item, index)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row class="text-right mx-5">
        <v-col>
          <v-btn @click="AddSemesterDialog">Add New</v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog2">
        <v-card>
          <v-card-title class="text-center">
            Add {{ edittype }} Item
          </v-card-title>
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
            <v-btn @click="AddSemester">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="text-center">
            Edit {{ edittype }} Item
          </v-card-title>
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
            <v-btn @click="EditSemester">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-if="edittype == 'divisions'">
      <h3 class="text-center ma-5 text-capitalize">Edit {{ edittype }}</h3>
      <v-row class="mx-5">
        <v-col>
          <v-select
            :items="courses"
            @change="selecteddivision"
            label="Select Course"
            v-model="course"
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-simple-table class="ma-3">
        <template v-slot:default>
          <thead>
            <th>{{ edittype }}</th>
            <th>Value</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ item.text }}</td>
              <td>{{ item.value }}</td>
              <td>
                <v-btn small text fab @click="EditDivisionDialog(item, index)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small text fab @click="RemoveDivision(item, index)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-row class="text-right mx-5">
        <v-col>
          <v-btn @click="AddDivisionDialog">Add New</v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog2">
        <v-card>
          <v-card-title class="text-center">
            Add {{ edittype }} Item
          </v-card-title>
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
            <v-btn @click="AddDivision">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title class="text-center">
            Edit {{ edittype }} Item
          </v-card-title>
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
            <v-btn @click="EditDivision">Save</v-btn>
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
      semesters: [],
      divisions: [],
      division: null,
      text: "",
      value: "",
      course: null,
      item: {},
      year: null,
      semester: null,
      index: null
    };
  },
  methods: {
    selectedCourseSubjects() {
      this.semesters = this.year.semesters;
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
                    this.items = this.courses[i].subjects[this.year.value][sem];
                    if (this.items == undefined) {
                      this.items = [];
                      flag = true;
                    }
                    flag = true;
                  }
                }
              }
            }
          }
        }
      });
      if (!flag) {
        this.items = [];
      }
    },
    selectedyear() {
      this.item = {};
      var flag = false;
      for (var yr in this.years) {
        if (this.years[yr].value == this.year.value) {
          this.items = this.year.semesters;
          flag = true;
        }
      }
      if (!flag) {
        this.items = [];
      }
    },
    selecteddivision() {
      this.item = {};
      var flag = false;
      for (var course in this.courses) {
        if (this.courses[course].value == this.course.value) {
          this.items = this.course.divisions;
          if (this.items == undefined) {
            this.items = [];
            flag = true;
          }
          flag = true;
        }
      }
      if (!flag) {
        this.items = [];
      }
    },
    EditDivisionDialog(item, index) {
      this.text = item.text;
      this.value = item.value;
      this.item = item;
      this.index = index;
      this.dialog = true;
    },
    EditDivision() {
      this.items[this.index].text = this.text;
      this.items[this.index].value = this.value;
      this.course.divisions[this.index].text = this.text;
      this.course.divisions[this.index].value = this.value;
      var courseIndex = -1;
      for (var course in this.courses) {
        if (this.course.value == this.courses[course].value) {
          courseIndex = course;
        }
      }
      if (courseIndex >= 0) {
        firebase
          .database()
          .ref("courses/" + courseIndex + "/divisions")
          .set(this.course)
          .then(() => {
            this.selecteddivision();
            this.dialog = false;
          });
      } else {
        alert("error");
      }
    },
    AddDivisionDialog() {
      this.text = "";
      this.value = "";
      this.item = {};
      this.index = null;
      this.dialog2 = true;
    },
    AddDivision() {
      this.items.push({
        text: this.text,
        value: this.value
      });
      var courseIndex = -1;
      for (var course in this.courses) {
        if (this.course.value == this.courses[course].value) {
          courseIndex = course;
        }
      }
      if (courseIndex >= 0) {
        firebase
          .database()
          .ref("courses/" + courseIndex + "/divisions")
          .set(this.items)
          .then(() => {
            this.selecteddivision();
            this.dialog2 = false;
          });
      } else {
        alert("error adddd");
      }
    },
    RemoveDivision(item, index) {
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
          if (this.course.value == this.courses[course].value) {
            courseIndex = course;
          }
        }
        if (courseIndex >= 0) {
          this.items.splice(index, 1);
          firebase
            .database()
            .ref("courses/" + courseIndex + "/divisions")
            .set(this.items)
            .then(() => {
              this.selecteddivision();
            });
        } else {
          alert("error removeee");
        }
      }
    },
    EditSemester() {
      this.items[this.index].text = this.text;
      this.items[this.index].value = this.value;
      this.year.semesters[this.index].text = this.text;
      this.year.semesters[this.index].value = this.value;
      var yearIndex = -1;
      for (var year in this.years) {
        if (this.year.value == this.years[year].value) {
          yearIndex = year;
        }
      }
      if (yearIndex >= 0) {
        firebase
          .database()
          .ref("years/" + yearIndex + "/" + this.edittype)
          .set(this.items)
          .then(() => {
            this.selectedyear();
            this.dialog = false;
          });
      } else {
        alert("error");
      }
    },
    AddSemesterDialog() {
      this.text = "";
      this.value = "";
      this.item = {};
      this.index = null;
      this.dialog2 = true;
    },
    AddSemester() {
      this.items.push({
        text: this.text,
        value: this.value
      });
      var yearIndex = -1;
      for (var year in this.years) {
        if (this.year.value == this.years[year].value) {
          yearIndex = year;
        }
      }
      if (yearIndex >= 0) {
        firebase
          .database()
          .ref("years/" + yearIndex + "/" + this.edittype)
          .set(this.items)
          .then(() => {
            this.selectedyear();
            this.dialog2 = false;
          });
      } else {
        alert("error adddd");
      }
    },
    RemoveSemester(item, index) {
      if (
        confirm(
          "Do You Really Want To Remove " +
            item.text +
            " : " +
            item.value +
            " ???"
        )
      ) {
        var yearIndex = -1;
        for (var year in this.years) {
          if (this.year.value == this.years[year].value) {
            yearIndex = year;
          }
        }
        if (yearIndex >= 0) {
          this.items.splice(index, 1);
          firebase
            .database()
            .ref("years/" + yearIndex + "/" + this.edittype)
            .set(this.items)
            .then(() => {
              this.selectedyear();
            });
        } else {
          alert("error removeee");
        }
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
              this.year.value +
              "/" +
              this.semester.value
          )
          .set(this.items)
          .then(() => {
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
              this.year.value +
              "/" +
              this.semester.value
          )
          .set(this.items)
          .then(() => {
            this.selectedCourseSubjects();
            this.dialog2 = false;
          });
      } else {
        alert("error adddd");
      }
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
            courseIndex = course;
          }
        }
        if (courseIndex >= 0) {
          this.items.splice(index, 1);
          firebase
            .database()
            .ref(
              "courses/" +
                courseIndex +
                "/" +
                this.edittype +
                "/" +
                this.year.value +
                "/" +
                this.semester.value
            )
            .set(this.items)
            .then(() => {
              this.selectedCourseSubjects();
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
    if (
      this.edittype == "courses" ||
      this.edittype == "subjects" ||
      this.edittype == "divisions"
    ) {
      firebase
        .database()
        .ref("courses")
        .on("value", snapshot => {
          if (this.edittype == "subjects" || this.edittype == "divisions") {
            this.courses = snapshot.val();
          } else {
            this.items = snapshot.val();
          }
        });
    }
    if (
      this.edittype == "years" ||
      this.edittype == "subjects" ||
      this.edittype == "semesters"
    ) {
      firebase
        .database()
        .ref("years")
        .on("value", snapshot => {
          if (this.edittype == "subjects" || this.edittype == "semesters") {
            this.years = snapshot.val();
          } else {
            this.items = snapshot.val();
          }
        });
    }
  }
};
</script>

<style></style>
