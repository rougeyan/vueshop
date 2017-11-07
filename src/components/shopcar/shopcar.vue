<template>
<div>
  <div class="shopcar">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
                    </div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需要配送费{{deliveryPrice}}元</div>
            </div>
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="totalPrice>=20?'enough':'notenough'">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <div v-for="ball in balls" :key="ball.id">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook">
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow" >
                <div class="list-header">
                    <div class="title">购物车</div>
                    <div class="empty" @click="empty">清空</div>
                </div>
                <div class="list-content" ref="listcontent">
                    <ul>
                        <li v-for="food in selectFoods" class="food" :key="food.id">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>${{food.price*food.count}}</span>
                            </div>
                            <div class="carcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
  </div>
  <transition name="fade">
    <div class="list-mark" v-show="listShow" @click="hideList"></div>
  </transition>
</div>
</template>
 <script type="text/ecmascript-6">
import cartcontrol from '../cartcontrol/cartcontrol';
import BScroll from 'better-scroll';
import Bus from '../../common/bus';
export default {
    // 通过接口附件获得数组;
    props: {
        selectFoods: {
            type: Array,
            default () {
                return [];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    // 设置本地变量
    data () {
        return {
            balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            dropBalls: [],
            fold: true
        };
    },
    created () {
        Bus.$on('getTarget', target => {
            this.drop(target);
        });
    },
    // computede 内的是会互相调用 主要是操作数据
    // 而放到DOM里面都是以{{totalPrice}}的形式放入;
    computed: {
        totalPrice () {
            let total = 0;
            console.log(this.selectFoods);
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount () {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
        },
        payDesc () {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return `去结算`;
            }
        },
        // 展示状态;
        // 满足条件1 大于0
        listShow () {
            // 等于0的情况; !0 == true
            if (!this.totalCount) {
                console.log(!this.totalCount);
                // 折叠状态为true
                this.fold = true;
                // v-show 为false 不显示
                return false;
            }
                // 取反 show= true;
            let show = !this.fold;
                //  同时只有true时候(虽然不点击,但是允许一步betterscroll);
                // 有数字 必定为真;
            if (show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.listcontent, {
                        // 默认禁止原生事件指令,因此要设置为click;
                        click: true
                    });
                   } else {
                       this.scroll.refresh();
                   }
                });
            }
            // 返回 true 值
            return show;
        }
    },
    methods: {
        // 可以访问computed的数据
        // 设定结算按钮弹出
        // 针对 click 动画等;
        pay () {
            console.log(this.minPrice);
            if (this.totalPrice < this.minPrice) {
                return;
            }
            window.alert(`支付${this.totalPrice}元`);
        },
        // 点击蒙版隐藏购物车; 折叠效果设置为true;
        hideList () {
            this.fold = true;
        },
        //  清空购物车 只要清空数量为0就可以了;
        empty () {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
        },
        // 满足条件2 -点击  点击条件时, 若count=0不允许点击 若不等于0 取反 不折叠;
        toggleList () {
            if (!this.totalCount) {
                return;
            }
            // 折叠
            this.fold = !this.fold;
        },
        // 小球动画  复制的 暂时不了解;
        drop (el) {
            console.log(el);
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
beforeEnter (el) {
    console.log(el);
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.querySelector('.inner-hook');
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter (el) {
      el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.querySelector('.inner-hook');
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
      });
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    }
    },
    // 注册组件
    components: {
        cartcontrol
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/mixin.scss';
.shopcar{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    background: #fff;
    .content{
        display: flex;
        background: #141d27;
        font-size: 0;
        .content-left{
            flex:1;
            .logo-wrapper{
                display: inline-block;
                position: relative;
                top: -10px;
                padding: 6px;
                margin: 0 12px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                border-radius: 50%;
                background: #141d27;
                vertical-align: top;
                .num{
                    position: absolute;
                    top:0;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    border-radius: 16px;
                    font-size: 9px;
                    font-weight: 700;
                    color: #fff;
                    background: rgb(240,20,20);
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
                }
                .logo{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2b343c;
                    text-align: center;
                    &.highlight{
                        background: rgb(0, 160, 220);
                    }
                    .icon-shopping_cart{
                        font-size: 24px;
                        color: #80858a;
                        line-height: 44px;
                        &.highlight{
                            color: #fff;
                            
                        }
                    }
                }
            }
            .price{
                display: inline-block;
                font-size: 24px;
                line-height: 24px;
                margin-top: 12px;
                box-sizing: border-box;
                padding-right: 12px;
                border-right: 1px solid rgba(255,255,255, 0.1);
                font-size: 16px;
                font-weight: 700;
                color: rgba(255,255,255, 0.4);
                &.highlight{
                    color: #fff;
                }
            }
            .desc{
                display: inline-block;
                vertical-align: top;
                margin: 12px 0 0 12px;
                line-height: 24px;
                font-size: 10px;
                color: rgba(255,255,255, 0.4);
            }
        }
        .content-right{
            flex: 0 0 105;
            width: 105px;
            .pay{
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 12px;
                color: rgba(255,255,255, 0.4);
                font-weight: 700;
                background: #2b333b;
                &.notenough{
                    background: #2b333b;
                }
                &.enough{
                    background: #00b43c;
                    color: #fff;
                }
            }
        }
    }
    .ball-container{
        .ball{
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;
            transition: all 0.5s cubic-bezier(.0,.0,.28,-0.35);
            .inner{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: rgb(0, 160, 220);
                transition: all 0.5s;
            }
        }
    }
    .shopcart-list{
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        width: 100%;
        //这里有坑, 应该将最终状态放入原样式中;
        transform:  translate3d(0,-100%,0);
        &.fold-enter-active, &.fold-leave-active {
            transition: all 0.4s ;
            opacity: 1
        }
        &.fold-enter, &.fold-leave-to{
            transition: all 0.4s ;
            opacity: 0;
            transform: translate3d(0,0,0);
        }
        .list-header{
            height: 40px;
            line-height: 40px;
            padding: 0 18px;
            background: #f3f5f7;
            border-bottom: 1px solid rgba(7,17,17, 0.1);
            .title{
                float: left;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .empty{
                float: right;
                font-size: 12px;
                color: rgb(0, 160, 210);
            }
        }
        .list-content{
            padding: 0 18px;
            max-height: 217px;
            background: #fff;
            overflow: hidden;
            .food{
                position: relative;
                padding: 12px 0;
                box-sizing: border-box;
                @include border-1px(rgba(7,17,17, 0.1));
                .name{
                    line-height: 24px;
                    font-size: 14px;
                    color: rgb(7,17,17);
                }
                .price{
                    position: absolute;
                    right: 90px;
                    bottom: 12px;
                    line-height: 24px;
                    font-size: 14px;
                    font-weight: 700;
                    color: rgb(240,20,20);
                }
                .carcontrol-wrapper{
                    position: absolute;
                    right: 0;
                    bottom: 6px;
                }
            }
        }
    }
}
.list-mark{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: rgba(7, 17, 27,.6);
    filter: blur(10px);
    &.fade-enter-active, &.fade-leave-active {
    transition: all 0.4s ;
    opacity: 1
    }
    &.fade-enter, &.fade-leave-to{
        transition: all 0.4s ;
        opacity: 0;
        background: rgba(7, 17, 27, 0);
    }
}
</style>


