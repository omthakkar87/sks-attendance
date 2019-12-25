<template>
  <div class="take">
    <v-container>
      <v-card>
        <v-card-text>
          <h2>Create Session</h2>
          <v-select @change="getlecture()" :items="courses" v-model="course" label="Course"></v-select>
          <v-select @change="getlecture()" :items="years" v-model="year" label="Year"></v-select>
          <v-select @change="updatelect" :items="lecture" label="Select Lecture" v-model="currentLecture">
            <template slot="selection" slot-scope="data">
              {{data.item.name}}
            </template>
            <template slot="item" slot-scope="data">
              {{data.item.name}}
            </template>
          </v-select>
          <v-layout v-if="this.currentLecture.name == 'Custom'">
            <v-flex xs6 sm6 md6 pr-2>
              <v-dialog
                ref="startDialog"
                v-model="startTimeModal"
                :return-value.sync="startTime"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="startTime" label="Start Time " readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="startTimeModal" v-model="startTime" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="startTimeModal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.startDialog.save(startTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs6 sm6 md6 pl-2>
              <v-dialog
                ref="endDialog"
                v-model="endTimeModal"
                :return-value.sync="endTime"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="endTime" label="End Time" readonly v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="endTimeModal" v-model="endTime" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="endTimeModal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.endDialog.save(endTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-flex>
          </v-layout>
          <v-layout v-if="this.currentLecture.name == 'Custom'">
            <v-flex xs4 sm4 md4 pr-2>
              <v-select :items="faculty" label="Faculty" v-model="currentFaculty"></v-select>
            </v-flex>
            <v-flex xs4 sm4 md4 pl-2 pr-2>
              <v-select :items="subject" label="Subject" v-model="currentSubject"></v-select>
            </v-flex>
            <v-flex xs4 sm4 md4 pl-2>
              <v-select :items="classroom" label="Classroom" v-model="currentClassroom"></v-select>
            </v-flex>
          </v-layout>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="starttaking()">Start</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startTime: "",
      startTimeModal: false,
      endTime: "",
      endTimeModal: false,
      courses: ["BSCIT", "BSCCS", "BMM", "BFM", "BA", "BCOM", "BBI", "BMS"],
      course: "BSCIT",
      years: ["FY", "SY", "TY"],
      year: "FY",
      lecture: [{name:"Custom"}],
      currentLecture: "",
      sessionid: 0,
      faculty: [],
      subject: [],
      classroom: [],
      currentFaculty: "",
      currentSubject: "",
      currentClassroom: "",
      currentStartTime: "",
      currentEndTime: "",
      currentnoOfLect: 0
    };
  },
  computed: {
    classes() {
      return this.year + this.course;
    },
    noOfLect() {
      var sh = parseInt(this.currentStartTime.substring(0, 2));
      var sm = parseInt(this.currentStartTime.substring(3, 5));
      var eh = parseInt(this.currentEndTime.substring(0, 2));
      var em = parseInt(this.currentEndTime.substring(3, 5));
      if(this.currentEndTime =="ed:ed" && this.currentStartTime == "ed:ed"){
      var sh = parseInt(this.startTime.substring(0, 2));
      var sm = parseInt(this.startTime.substring(3, 5));
      var eh = parseInt(this.endTime.substring(0, 2));
      var em = parseInt(this.endTime.substring(3, 5));
      }

      return parseInt((parseInt(eh * 60 + em) - (sh * 60 + sm)) / 50);
    }
  },
  methods: {
    starttaking() {
      var today = new Date();
      this.sessionid = 0;
      for (var i = 0; i < this.classes.length; i++) {
        // console.log(this.classes.charCodeAt(i));
        this.sessionid = this.sessionid + this.classes.charCodeAt(i);
        console.log(this.sessionid);
      }
      this.sessionid =
        this.sessionid *
        today.getDate() *
        today.getMonth() *
        today.getFullYear() *
        today.getHours() *
        today.getMinutes() +
        today.getSeconds() *
        today.getSeconds() +
        today.getSeconds()
        this.noOfLect * this.noOfLect * this.startTime;
      if (this.sessionid >= 9999) {
        this.sessionid = this.sessionid % 10000;
      }
      if (this.sessionid <= 999) {
        this.sessionid = this.sessionid + today.getFullYear();
      }
      alert(this.sessionid);
      if(this.currentEndTime =="ed:ed" && this.currentStartTime == "ed:ed"){
      this.currentStartTime = this.startTime
      this.currentEndTime = this.endTime
      }
      firebase
        .database()
        .ref("sessions/" + this.sessionid + "/lecture/")
        .set({
          status: "started",
          faculty: this.currentFaculty,
          subject: this.currentSubject,
          noOfLect: this.noOfLect,
          classroom: this.currentClassroom,
          startTime: this.currentStartTime,
          endTime: this.currentEndTime,
          timestamp: Date.now()
        });
      this.$router.push("/Session/" + this.sessionid);
    },
    updatelect(lect){
      this.currentFaculty = lect.faculty
      this.currentSubject = lect.subject
      this.currentClassroom = lect.classroom
      this.currentStartTime = `${("0" + lect.starthr).slice(-2)}:${("0" + lect.startmin).slice(-2)}`
      this.currentEndTime = `${("0" + lect.endhr).slice(-2)}:${("0" + lect.endmin).slice(-2)}`
      this.currentnoOfLect = lect.noOfLect
    },
    getlecture() {
      var days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];
      var today = new Date();
      this.lecture = [];
      firebase
        .database()
        .ref("lectures/" + this.classes + "/" + days[today.getDay()] + "/")
        .once("value", snapshot => {
          console.log(snapshot.val());
          snapshot.forEach(lecture => {
            var lect = lecture.val();
            var time = today.getHours() * 60 + today.getMinutes();
            var starttime = lect.starthr * 60 + lect.startmin;
            var endtime = lect.endhr * 60 + lect.endmin;
            if (time >= starttime && time <= endtime) {
              this.currentLecture.push({...lect,"name":`${lect.subject}(${lect.faculty}) ${("0" + lect.starthr).slice(-2)}:${("0" + lect.startmin).slice(-2)} - ${("0" + lect.endhr).slice(-2)}:${("0" + lect.endmin).slice(-2)}`});
            }
            this.lecture.push({...lect,"name":`${lect.subject}(${lect.faculty}) ${("0" + lect.starthr).slice(-2)}:${("0" + lect.startmin).slice(-2)} - ${("0" + lect.endhr).slice(-2)}:${("0" + lect.endmin).slice(-2)}`});
            // this.faculty.push(lect.faculty);
            // this.subject.push(lect.subject);
            // this.classroom.push(lect.classroom);
          });

          this.lecture.push({name:"Custom"});
        });
      firebase.database().ref("faculties/" + this.classes + "/").once('value',(snapshot)=>{
        snapshot.forEach((fac)=>{
          this.faculty.push(fac.val())
        })
      })
      firebase.database().ref("subjects/" + this.classes + "/").once('value',(snapshot)=>{
        snapshot.forEach((sub)=>{
          this.subject.push(sub.val())
        })
      })
      firebase.database().ref("classrooms/").once('value',(snapshot)=>{
        snapshot.forEach((cls)=>{
          this.classroom.push(cls.val())
        })
      })
    }
  }
};
</script>

<style>
</style>