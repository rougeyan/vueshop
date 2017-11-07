<template>
    <div class="ratings"ref="rass">
      <div class="ratings-content">
          <div class="overview">
            <div class="overview-left">
              <h1 class="score">{{seller.score}}</h1>
              <div class="title">综合评分</div>
              <div class="rank">高于周边上架{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
              <div class="score-wrapper">
                <span class="title">服务态度</span>
                <xingxing :size="36" :score="seller.serviceScore"></xingxing>
                <span class="score">{{seller.serviceScore}}</span>
              </div>
              <div class="score-wrapper">
                <span class="title">商品评分</span>
                <xingxing :size="36" :score="seller.foodScore"></xingxing>
                <span class="score">{{seller.foodScore}}</span>
              </div>
              <div class="delivery-wrapper">
                <span class="title">送达时间</span>
                <span class="delivery">{{seller.deliveryTime}}分钟</span>
              </div>
            </div>
          </div>
        <split></split>
        <ratingselect @select-type="SeType" @toggle-content="OnContent" :rating="ratingss" ref="rs"></ratingselect>
        <div class="rating-wrapper">
          <ul>
            <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,index) in ratingss" :key="rating.id" class="rating-item">
              <div class="avatar">
                <img :src="rating.avatar" width="28" height="28">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <xingxing :size="24" :score="rating.score"></xingxing>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                  <span class="item" v-for="item in rating.recommend" :key="item.id">{{item}}</span>
                </div>
                <div class="time">{{rating.rateTime | formateDay }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';
  import ratingselect from '../ratingselect/ratingselect';
  import split from '../split/split';
  // 下面两个是引入模块;
  //  BScroll 模块;
  import BScroll from 'better-scroll';
  // 自定义函数模块
  import {formatDate} from '../../common/date';
// 定义常量 const 恒久不变;
  const ALL = 2;
  const ERR_OK = 0;

export default {
  // 通过app.vue 的view-router 接受seller的属性;
  // 数据接口
  props: {
    seller: {
      type: Object
    }
  },
  // 数据变量 (可变),与上面const 常量不同;
  data () {
      return {
        ratingss: [],
        selectType: ALL,
        onlyContent: false
      };
  },
  methods: {
    // SeType (type) 中 形参 type是ratingselect的 $emit 传入的参数,即type
    // 父组件 - 子组件  自定义事件; 获取ratingsselect 的selectType 类型改变父组件的状态;
    SeType (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
        // console.log(this.selectType);
    },
    // 同理 con是ratingselect的 $emit 传入的参数 this.oContent;
    OnContent (con) {
        this.onlyContent = con;
        //  技巧;
        // 每次重新选择完后置.scroll 都要刷新 不然会扑街;
        // 为什么要$nextTick() this.scroll.refresh呢? 是因为加入Dom 只绑定数据没有重新选软
        // 不妨可以试一下refresh 很蠢的;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
        // console.log('food组件的this.onlycontent是' + this.onlyContent);
    },
    needShow (ratingtype, text) {
        // console.log('!text是' + !text);
        // console.log('this.onlyContent是' + this.onlyContent);
        // console.log(this.onlyContent && !text);
        // 首先判断是否要显示内容
        // 如果只包含评价(打勾)  且    !text  !""为true
        if (this.onlyContent && !text) {
            // console.log('needshow的this.selectType' + this.selectType);
            // console.log('type的类型为' + ratingtype);
            return false;
        }
        // 选择类型  如果是全部的话通过
        if (this.selectType === ALL) {
            return true;
        } else {
            // 否则选择类型跟selecType一样;
            return ratingtype === this.selectType;
        }
    }
  },
  // 数据过滤器
  // formateDate 是外部模块
  filters: {
        // 这里的formatDay 是指的是标签共同的过滤函数
        formateDay (time) {
            let date = new Date(time);
            // 这里的formatDate 是引用js 模块的函数;
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
  // 组件创建后; 获取后台数据;
  created () {
    // 获取ratings 数据后, 数据内容足够撑开 可以BScroll 允许滚动
    // 与seller 组件有差别;
    this.$http.get('/api/ratings').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.ratingss = response.data;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.rass, {
              click: true
            });
        });
      }
    });
  },
  // 注册组件
  components: {
    'xingxing': star,
    split,
    ratingselect
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/mixin.scss';
  .ratings{
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview{
      display: flex;
      padding: 18px 0;
      .overview-left{
        flex: 0 0 137px;
        width: 137px;
        border-right: 1px solid rgba(7,17,27,0.1);
        text-align: center;
        padding: 6px 0;
        // @media 规则 根据screen 的最大宽度改变flex 与width
        // 适用与 1pone5s代
        @media  only screen and (max-width:320px){
          flex: 0 0 120px;
          width: 120px;
        }
        .score{
          line-height: 28px;
          font-size: 24px;
          color: rgb(255, 153, 0);
        }
        .title{
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .rank{
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
      .overview-right{
        flex: 1;
        padding: 6px 0 6px 24px;
        @media  only screen and (max-width:320px){
          padding: 0 3px 0 3px;
        }
        .score-wrapper{
          font-size: 0px;
          margin-bottom: 8px;
          .title{
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
          }
          .star{
            display: inline-block;
            vertical-align: top;
            margin:  0 12px;
          }
          .score{
            display: inline-block;
            vertical-align: top;
            line-height: 18px;
            font-size: 12px;
            color: rgb(255, 153, 0);
          }
        }
        .delivery-wrapper{
          font-size: 0;
          .title{
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 18px;
          }
          .delivery{
            margin-left: 12px;
            font-size: 12px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
    .rating-wrapper{
      padding: 0 18px;
      .rating-item{
        display: flex;
        padding: 18px 0;
        @include border-1px(rgba(7,17,27,0.1));
        .avatar{
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          img{
            border-radius: 50%;
          }
        }
        .content{
          position: relative;
          flex: 1;
          .name{
            margin-bottom: 4px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(7, 17, 27);
          }
          .star-wrapper{
            margin-bottom:6px;
            font-size: 0;
            .star{
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
            }
            .delivery{
              display: inline-block;
              vertical-align: top;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .text{
            margin-bottom: 8px;
            line-height: 18px;
            color: rgb(7, 17, 27);
            font-size: 12px;
          }
          .recommend{
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up, .item{
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up{
              color:rgb(0, 160, 220);
            }
            .item{
              padding: 0 6px;
              border: 1px solid rgba(7,17,27,0.1);
              border-radius: 1px;
              color: rgb(147, 153, 159);
              background: #fff;
            }
          }
          .time{
            position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>
