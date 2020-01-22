<template>
  <div class="mark text-center">
    <v-container pt-5>
      <h1>Waiting For Server</h1>
      <h3>To Mark Your Attendance</h3>
      <table border="3">
        <tr v-for="(btdevice,index) in btdevices" :key="index">
          <th>{{index}}) {{btdevice}}</th>
        </tr>
      </table>
    </v-container>
  </div>
</template>

<script>
import { insidePolygon } from "geolocation-utils";
import firebase from "firebase";
export default {
  data() {
    return {
      gps: {
        latitude: "",
        longitude: "",
        accuracy: "",
        inside: ""
      },
      btdevices: [],
      id: ""
    };
  },
  methods: {
    checkcode() {
      //query database for a session with sessionid
      firebase
        .database()
        .ref("/sessions/" + this.$route.params.sessionid)
        .once("value", snapshot => {
          if (snapshot.val() == null) {
            console.log("checkcode -> INVALID CODE");
            this.$router.push("/StudentHome");
          } else {
            console.log("checkcode -> VALID CODE & SESSION EXIST");
            this.initandscanbt();
          }
        });
    },
    getgps() {
      // gives the gps lati,longi & accuracy of device.
      navigator.geolocation.getCurrentPosition(
        position => {
          this.gps.latitude = position.coords.latitude;
          this.gps.longitude = position.coords.longitude;
          this.gps.accuracy = position.coords.accuracy;
          var bounds = [
            [19.2016, 72.97],
            [19.2016, 72.97],
            [19.202, 72.9695],
            [19.202, 72.9695],
            [19.2016, 72.97]
          ];
          var point = [this.gps.longitude, this.gps.latitude];
          var x = insidePolygon(point, bounds);
          this.gps.inside = x;
          firebase
            .database()
            .ref(
              "sessions/" +
                this.$route.params.sessionid +
                "/attendance/" +
                this.id
            )
            .update({
              gps: this.gps
            });
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
            this.id +
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
    initandscanbt() {
      var devices = [];
      bluetoothSerial.setName("SKS" + this.id);
      bluetoothSerial.setDiscoverable(0);
      //added a listener for my bt.
      this.getgps();
      //discovering others now
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
      alert("SUCCESSFULLY MARKED");
    }
  },
  mounted() {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value", snapshot => {
        this.id = snapshot.val().id;
        this.checkcode();
      });
  }
};
</script>

<style>
</style>