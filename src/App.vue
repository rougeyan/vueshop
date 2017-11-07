<template>
  <div id="app">
     <vhead v-bind:seller="sellera"></vhead>
     <div class="tab border-1px">
       <div class="tab-item ">
          <router-link to="/goods">商品</router-link>
       </div>
       <div class="tab-item">
         <router-link to="/ratings">评论</router-link>
       </div>
       <div class="tab-item">
         <router-link to="/seller">商家</router-link>
       </div>
     </div>
     <keep-alive>
       <router-view :seller="sellera" keep-alive></router-view> 
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">
import header from '../src/components/header/header';
import {urlParse} from './common/util';
const ERR_OK = 0;
export default {
  data () {
    return {
      sellera: {
        // 立即执行函数;
        // 用户id 引入模块,返回id;
        id: (() => {
          // 外部模块 import
          let queryParam = urlParse();
          // console.log(queryParam.id);
          return queryParam.id;
        })()
      }
    };
  },
  created () {
    this.$http.get('/api/seller?id=' + this.sellera.id).then((response) => {
      // console.log(response);
      response = response.body;
      console.log(response.data);
      if (response.errno === ERR_OK) {
        // ES6 对象扩展属性;
        // 目测理解是:
        // 第一个参数是目标对象
        // Object.assign(target, source1, source2);
        // Object.assign方法用于对象的合并，将源对象（ source ）的所有可枚举属性，复制到目标对象（ target ）
        // this.sellera 以数组的形式 加入到response.data中,并返回到this.sellera;
        this.sellera = Object.assign({}, this.sellera, response.data);
        // console.log(this.sellera);
        console.log(this.sellera.id);
      }
    });
  },
  name: 'app',
  components: {
    'vhead': header
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import './common/mixin';
  .tab{
    display: flex;
    height: 40px;
    line-height: 40px;
    @include border-1px(rgba(7,17,27,0.1));
    .tab-item{
      flex: 1;
      text-align: center;
      a{
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);
      }
      .active{
        color: red;
      }
    }
  }
</style>
