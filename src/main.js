import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import firebase from 'firebase';

Vue.config.productionTip = false


const firebaseConfig = {
  apiKey: "AIzaSyCUTHRJo6tMY96W13Waec1NCNxNLWFsEaY",
  authDomain: "sks-attendance.firebaseapp.com",
  databaseURL: "https://sks-attendance.firebaseio.com",
  projectId: "sks-attendance",
  storageBucket: "",
  messagingSenderId: "515804574384",
  appId: "1:515804574384:web:e9f17c0928a87a1e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  firebase,
  render: h => h(App)
}).$mount('#app')
