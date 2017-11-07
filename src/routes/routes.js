// 这里已经是两部了, 一般是头部import组件,
// 但是这里在component 直接利用require 引入,因此省略掉import过程
// @ 选线
const routes = [
  {
    path: '/goods',
    name: 'goods',
    component: require('@/components/goods/goods')
  },
  {
    path: '/seller',
    name: 'seller',
    component: require('@/components/seller/seller')
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: require('@/components/ratings/ratings')
  }
];
export default routes;
