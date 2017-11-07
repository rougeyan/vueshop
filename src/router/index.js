import Vue from 'vue';
import Router from 'vue-router';
import routes from '../routes/routes';

Vue.use(Router);
// 创建router 实例;
const router = new Router({
  routes,
  linkActiveClass: 'active'
});

export default router;
