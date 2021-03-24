
<template>
  <div class="mark text-center">
    <v-container pt-5>
      <h1>Waiting For Peers</h1>
      <h3>To Mark Your Attendance</h3>
      <br>
      <h5>All Discovered Devices</h5>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <th>Sr. No.</th>
            <th>Device's BT Name</th>
          </thead>
          <tbody>
            <tr v-for="(btdevice,index) in btdevices" :key="index">
              <td>{{index}}</td>
              <td>{{btdevice}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <br>
      <h5>Students Whose Attendance You Marked</h5>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <th>Sr. No.</th>
            <th>Device's BT Name</th>
          </thead>
          <tbody>
            <tr v-for="(btdevice,index) in sksdevice" :key="index">
              <td>{{index}}</td>
              <td>{{btdevice}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-snackbar
      v-model="snackbar"
      color="primary darken-2 white--text"
      light
      timeout="100000000000"
      class="text-center"
    >
    Please Wait On This Page Until The Session Ends
    </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      snackbar:false,
      gps: {
        latitude: null,
        longitude: null,
        accuracy: null,
        inside: null
      },
      sksdevice: [],
      btdevices: []
    };
  },
  props: ["clgid"],
  methods: {
    checkcode() {
      firebase
        .database()
        .ref("/sessions/" + this.$route.params.sessionid)
        .once("value", snapshot => {
          if (snapshot.val() == null) {
            console.log("checkcode -> INVALID CODE");
            this.$router.push("/StudentHome");
            return false;
          } else {
            console.log("checkcode -> VALID CODE & SESSION EXIST");
            this.initandscanbt();
            return true;
          }
        });
    },
    getgps() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.gps.latitude = position.coords.latitude;
          this.gps.longitude = position.coords.longitude;
          this.gps.accuracy = position.coords.accuracy;
          var bounds = {
            x1: 19.076322,
            x2: 19.075765,
            y1: 72.898673,
            y2: 72.899249
          };
          var point = [this.gps.latitude, this.gps.longitude];
          var x = this.inside(
            point,
            bounds,
            Math.sqrt(this.gps.accuracy) / 100
          );
          this.gps.inside = x;
          firebase
            .database()
            .ref(
              "sessions/" +
                this.$route.params.sessionid +
                "/attendance/" +
                this.clgid +
                "/gps"
            )
            .set(this.gps);
        },
        error => {
          alert(error.code + " : " + error.message);
        },
        { enableHighAccuracy: true }
      );
    },
    getbt() {
      firebase
        .database()
        .ref(
          "sessions/" +
            this.$route.params.sessionid +
            "/attendance/" +
            this.clgid +
            "/bt"
        )
        .on("value", snapshot => {
          if (snapshot.val() == null) {
            console.log("getbt -> BT NULL : " + JSON.stringify(snapshot.val()));
          } else {
            console.log("getbt -> BT SNAP : " + JSON.stringify(snapshot.val()));
            if (snapshot.val()) {
              this.marksuccess();
            }
          }
        });
    },
    inside(point, bounds, accuracy) {
      accuracy = accuracy / 100;
      if (
        point[0] > bounds.x1 - accuracy &&
        point[0] < bounds.x2 + accuracy &&
        point[1] > bounds.y1 - accuracy &&
        point[1] < bounds.y2 + accuracy
      )
        return true;

      return false;
    },
    initandscanbt() {
      var devices = [];
      bluetoothSerial.setName("SKS" + this.clgid);
      bluetoothSerial.setDiscoverable(0);
      this.getgps();
      bluetoothSerial.setDeviceDiscoveredListener(device => {
        if (device.name) {
          console.log("Found: " + device.name);
          devices.push(device.name);
        }
      });
      bluetoothSerial.discoverUnpaired(
        success => {
          console.log(success);
          devices.concat(success);
          console.log(devices);
          devices = Array.from(new Set(devices));
          console.log(devices);
          devices.forEach(device => {
            if (device.substring(0, 3) == "SKS") {
              this.sksdevice.push(device.substring(3));
              firebase
                .database()
                .ref(
                  "sessions/" +
                    this.$route.params.sessionid +
                    "/attendance/" +
                    device.substring(3)
                )
                .update({
                  bt: true
                });
            }
          });
          this.btdevices = devices;
          this.getbt();
        },
        failure => {
          alert(JSON.stringify(failure));
        }
      );
    },
    marksuccess() {
      var devices = [];
      alert("Your Attendance Is Marked Successfully!!!");
      this.snackbar = true;
      bluetoothSerial.setDeviceDiscoveredListener(device => {
        if (device.name) {
          console.log("Found: " + device.name);
          devices.push(device.name);
        }
      });
      bluetoothSerial.discoverUnpaired(
        success => {
          console.log(success);
          devices.concat(success);
          console.log(devices);
          devices = Array.from(new Set(devices));
          console.log(devices);
          devices.forEach(device => {
            if (device.substring(0, 3) == "SKS") {
              this.sksdevice.push(device.substring(3));
              firebase
                .database()
                .ref(
                  "sessions/" +
                    this.$route.params.sessionid +
                    "/attendance/" +
                    device.substring(3)
                )
                .update({
                  bt: true
                });
            }
          });
          this.btdevices = devices;
        },
        failure => {
          alert(JSON.stringify(failure));
        });
    }
  },
  mounted() {
    this.checkcode();
    this.getbt();
    firebase
      .database()
      .ref("sessions/" + this.$route.params.sessionid + "/lecture/status")
      .on("value", snapshot => {
        if (snapshot.val() == "ended") {
          alert("Session Ended");
          this.$router.push("/StudentHome");
        }
        if (snapshot.val() == null) {
          alert("Session Ended");
          this.$router.push("/StudentHome");
        }
      });
  }
};
</script>

<style>
</style>