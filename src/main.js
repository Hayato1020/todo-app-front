import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { initializeApp } from "firebase/app";

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};
initializeApp(firebaseConfig);

let GlobalData = new Vue({
  data: {
    $accessToken: "", // グローバル変数
  }
});

// 2. mixin でグローバル変数をラッピングする
Vue.mixin({
  methods: {
    // 2-1. 各コンポーネント内の<script>タグ内でグローバル変数を参照するための関数
    $_accessToken() {
      return GlobalData.$data.$accessToken
    },
    $_setAccessToken(newAccessToken) {
      GlobalData.$data.$accessToken = newAccessToken;
    }
  },
  computed: {
    // 2-2. 各コンポーネント内の<template>タグ内でグローバル変数を参照するための処置
    $accessToken: {
      get: function () { return GlobalData.$data.$accessToken },
      set: function (newAccessToken) { GlobalData.$data.$accessToken = newAccessToken; }
    }
  }
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
