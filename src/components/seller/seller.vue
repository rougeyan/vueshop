<template>
    <div class="seller" ref="rts">
        <div class="seller-content">
            <div class="overview">
              <h1 class="title">{{seller.name}}</h1>
              <div class="desc">
                  <xingxing :size="36" :score="seller.score">{{seller.score}}</xingxing>
                  <span class="text">({{seller.ratingCount}})</span>
                  <span class="text">月售{{seller.sellCount}}单</span>
              </div>
              <ul class="remark">
                <li class="block">
                  <h2>起送价</h2>
                  <div class="content">
                    <span class="stress">{{seller.minPrice}}</span>元
                  </div>
                </li>
                <li class="block">
                  <h2>商家配送</h2>
                  <div class="content">
                    <span class="stress">{{seller.deliveryPrice}}</span>元
                  </div>
                </li>
                <li class="block">
                  <h2>平均配送时间</h2>
                  <div class="content">
                    <span class="stress">{{seller.deliveryTime}}</span>分钟
                  </div>
                </li>
              </ul>
              <div class="favorite" @click="toggleFavorite">
                <span class="icon-favorite" :class="{'active':favorite}"></span>
                <span class="text">{{favoriteText}}</span>
              </div>
            </div>
            <split></split>
            <div class="bulletin">
              <h1 class="title">公告与活动</h1>
              <div class="content-wrapper">
                <p class="content">{{seller.bulletin}}</p>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="item.id">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
                </li> 
              </ul>
            </div>
            <split></split>
            <div class="pics">
              <h1 class="title">商家实景</h1>
              <div class="pic-wrapper" ref="picwrapper">
                <ul class="pic-list" ref="piclist">
                  <li class="pic-item" v-for="pic in seller.pics" :key="pic.id">
                    <img :src="pic" width="120" height="90">
                  </li>
                </ul>
              </div>
            </div>
            <split></split>
            <div class="info">
              <h1 class="title border-1px">商家信息</h1>
              <ul>
                <li class="info-item" v-for="info in seller.infos" :key="info.id">{{info}}</li>
              </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/store';
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      // 必须是一个立即执行函数;
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false);
      })()
    };
  },
  computed: {
    favoriteText () {
      // if favorite 是不是 =true 是则返回第一个;false第二个
      return this.favorite ? '收藏' : '未收藏';
    }
  },
  created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  // 这里的坑大概说一下;
  // 虽然很多概念还是不理解;
  // 加入seller组件原地刷新. 是无法进行滚动的;
  // 原因是获取seller接口的数据 是一个异步过程;
  // 下面mountde console的是    {__ob__: Observer};而不是一个罕有avatar等等的对象;
  // 因此获取的数据无法撑开内容使得BScroll 滚动;
  // ????????疑问的地方既然还未获取为什么最后又能够渲染呢?
  // 我们就在创建一个methods 创建一个初始化BScroll函数_initBScroll;
  // 利用下面watch监视这个seller, 一旦发生变化,立即调用methods中的_initScroll()函数;
  // _initScroll() 实用nextTick 是因为sller对象数据发生改变.DOM渲染是移步过程, 因此要nextTick执行;
  // 这里有个顺序:  优先级: mouted() > watch; 所以要_initScroll () 加入else this.scroll.refresh();
  // 顺序是 moutede 执行调用_initScroll () 没有计算正确是seller不对;
  // 然后watch 监听到seller 变化 调用_initScroll(); 存在了this.scroll 因此执行else this.scroll.refresh;
  watch: {
    'seller' () {
      this._initScroll();
      this._picScroll();
    }
  },
  mounted () {
      // 原地刷新 此处执行时,seller对象为 {__ob__: Observer};
      this._initScroll();
      console.log('mounted执行了');
      console.log('此处执行的执行seller是' + this.seller);
      this._picScroll();
  },
  methods: {
    toggleFavorite (event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      saveToLocal(this.seller.id, 'favorite', this.favorite);
      localStorage.favorite = this.favorite;
    },
    _initScroll () {
      this.$nextTick(() => {
        if (!this.scroll) {
          // 其实这里是this.socroll模块定义的;
          // this.scorll 为false 然后定义 并且允许这个模块;
          // 没有this.scroll 时候定义;
          // else refresh 这个scroll 容器的高度;
          this.scroll = new BScroll(this.$refs.rts, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    _picScroll () {
      if (this.seller.pics) {
        // 内层宽度重新计算才能左右滚动;
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        // 获取这个piclist的实际长度;
        this.$refs.piclist.style.width = width + 'px';
        console.log(this.$refs.piclist.style.width);
        this.$nextTick(() => {
          // 如果没有 则创建;
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picwrapper, {
              scrollX: true,
              // 下面这个在横向滚动的时候忽略垂直滚动;
              eventPassthrough: 'vertical'
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    }
  },
  components: {
    'xingxing': star,
    split
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/mixin.scss';
  .seller{
    position:absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview{
      padding: 18px;
      .title{
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27)
      }
      .desc{
        padding-bottom: 18px;
        color: rgb(7, 17, 27);
        @include border-1px(rgba(7,17,27,0.1));
        font-size: 0;
        .star{
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text{
          display: inline-block;
          line-height: 18px;
          margin-right: 12px;
          vertical-align: top;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
      .remark{
        display: flex;
        padding-top: 18px;
        .block{
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,0.1);
          &:last-child{
            border: none;
          }
          h2 {
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 159, 159);
          }
          .content{
            line-height: 24px;
            font-size: 10px;
            color: rgb(7, 17, 27);
            .stress{
              font-size: 24px;
            }
          }
        }
      }
      .favorite{
        position: absolute;
        right: 18px;
        top: 18px;
        text-align: center;
        width: 36px;
        height: 40px;
        .icon-favorite{
          display: block;
          font-size: 24px;
          color: rgb(147, 159, 159);
          line-height: 24px;
          &.active{
            color: rgb(240,20,20);
          }
        }
        .text{
          font-size: 10px;
          line-height: 10px;
          color: rgb(77, 85, 93);
        }
      }
    }
    .bulletin{
      padding: 18px 18px 0 18px;
      .title{
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27)
      }
      .content-wrapper{
        padding: 0 12px 16px 12px;
        @include border-1px(rgba(7,17,27,0.1));
        .content{
          line-height: 24px;
          font-size: 12px;
          color: rgb(240,20,20);
        }
      }
      .supports{
        .support-item{
          padding: 16px 12px;
          @include border-1px(rgba(7,17,27,0.1));
          font-size: 0;
          &:last-child{
            &:after{
              border:none;
            }
          }
          .icon{
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            &.decrease{
              @include bg-image('decrease_4');
            }
            &.discount{
              @include bg-image('discount_4');
            }
            &.guarantee{
              @include bg-image('guarantee_4');
            }
            &.invoice{
              @include bg-image('invoice_4');
            }
            &.special{
              @include bg-image('special_4');
            }          
          }
          .text{
            font-weight: 200;
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27)
          }
        }
      }
    }
    .pics{
      padding: 18px;
      .title{
        margin-bottom: 12px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27)
      }
      .pic-wrapper{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list{
          font-size: 0;
          .pic-item{
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
    .info{
      padding: 18px 18px 0 18px;
      color: rgb(7,17,27);
      .title{
        padding-bottom: 12px;
        line-height: 14px;
        @include border-1px(rgba(7,17,27,0.1));
        font-size: 14px;
      }
      .info-item{
        padding: 16px 12px;
        line-height: 16px;
        @include border-1px(rgba(7,17,27,0.1));
        font-size: 12px;
        &:last-child{
          &::after{
            border: none;
          }
        }
      }
    }
  }
</style>

