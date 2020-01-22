// app.js

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/scss/materialdesignicons.scss'

Vue.use(Vuetify, {
  iconfont: 'mdi',
})

export default new Vuetify({
  theme: {
    dark: true,
    themes:{
      dark:{
        primary:"#00bcd4"
      }
    }
  },
});
