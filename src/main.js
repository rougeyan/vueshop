// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './common/index.scss';
import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import Resource from 'vue-resource';

Vue.config.productionTip = false;
Vue.use(Resource);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
