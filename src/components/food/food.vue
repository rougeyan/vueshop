<template>
    <transition name="food">
        <div v-show="showFlag" class="food" ref="foodd">
            <div class="foodcontent">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back">
                        <i class="icon-arrow_lift" @click="hide"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detaill">
                        <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="noww">R{{food.price}}</span><span v-show="food.oldPrice" class="oldd">R{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-warpper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
                    </transition>
                </div>
                <!-- split作为过度效果 -->
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :selectType="selectType" :onlyContent="onlyContent" @select-type="SeType" @toggle-content="OnContent"  :desc="desc" :rating="food.ratings" ref="rs"></ratingselect>
                    <div class="rating-wrapper">      
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" :key="rating.id" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                                </div>
                                <div class="time">{{rating.rateTime | formateDay}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div> 
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

 <script type="text/ecmascript-6">
// 引入实例 event bus 非父子间通讯; food 的"加入购物车"到购物车组件通讯;
import Vue from 'vue';
import Bus from '../../common/bus';
 // 组件
import cartcontrol from '../cartcontrol/cartcontrol';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';
// 实用花括号引用 没有花括号是 export default; 有花括号是export function
// import {formatDate , nimabi(里面的另外一个函数)} from '../../common/date';
import {formatDate} from '../../common/date';
import BScroll from 'better-scroll';

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
    props: {
        food: {
            type: Object
        }
    },
    // 定义数据变量 (可变),
    data () {
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: false,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        };
    },
    // vue 的 过滤器
    // 讲formateDate 定义为一个模块,方便以后其他组件使用;
    filters: {
        // 这里的formatDay 是指的是标签共同的过滤函数
        formateDay (time) {
            let date = new Date(time);
            // 这里的formatDate 是引用js 模块的函数;
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    // 方法 负责放入标签的各类方法;
    methods: {
        show () {
            // 每一次都重置一个 show 的所有默认值;
            // 默认 true ALL false;
            this.showFlag = true;
            this.selectType = ALL;
            this.onlyContent = false;
                    // console.log('打开food组件的selectType是   ' + this.selectType);
            // ******
            // ratingselect组件的refresh() 是为了关闭 时候重置评价列表;
            // 即使关闭后, selectType发生变化, 但是sType 并不发生变法;
            this.$refs.rs.refish();
            // $nextTick()???
            this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodd, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
        },
        // 隐藏按钮
        hide () {
            this.showFlag = false;
            // console.log('关闭food组件的selectType为  ' + this.selectType + ' 已传入到父组件');
        },
        // **
        // 第一次他添加启用的 Event BUS 非父子间通讯;
        addFirst (event) {
        if (!event._constructed) {
            return;
        };
            Vue.set(this.food, 'count', 1);
            Bus.$emit('getTarget', event.target);
        },
        // 下面这个例子是父子间通讯
            //     if (this.showFlag) {
            //         this.$nextTick(() => {
            //             this._initScroll();
            //         });
            //     }
            // },
            // _initScroll () {
            //     console.log(this.$refs.foodd);
            //     if (!this.foodd) {
            //         this.scroll = new BScroll(this.$refs.foodd, {
            //             click: true
            //         });
            //         } else {
            //         this.scroll.refresh();
            //     }
            // *
            // *
        // SeType (type) 中 形参 type是ratingselect的 $emit 传入的参数,即type
        // 父组件 - 子组件  自定义事件; 获取ratingsselect 的selectType 类型改变父组件的状态;
        SeType (type) {
            this.selectType = type;
            // console.log(this.selectType);
        },
        // 同理 con是ratingselect的 $emit 传入的参数 this.oContent;
        OnContent (con) {
            this.onlyContent = con;
            // console.log('food组件的this.onlycontent是' + this.onlyContent);
        },
        // 过滤规则 附入到v-show 函数的用法 比较6
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
    components: {
        cartcontrol,
        split,
        ratingselect
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/mixin.scss';
    .food{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 48px;
        z-index: 30;
        width: 100%;
        background: #eee;
        // 注意transform是最终的状态;
        // 在设置动画的时候要先知道动画原始状态;
        transform:  translate3d(0,0,0);
        &.food-enter-active, &.food-leave-active {
            transition: all 0.2s linear ;
            opacity: 1
        }
        &.food-enter, &.food-leave-to{
            transition: all 0.2s linear ;
            opacity: 0;
            // 100为右 -100为左;
            transform: translate3d(100%,0,0);
        }
        .foodcontent{
            .image-header{
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;
                img{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .back{
                    position: absolute;
                    top: 10px;
                    left: 0;
                    .icon-arrow_lift{
                        display: block;
                        padding: 18px;
                        color: #fff;
                    }
                }
            }
            .content{
                position: relative;
                padding: 18px;
                .title{
                    line-height: 14px;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    color: rgb(7, 17, 27);
                }
                .detaill{
                    margin-bottom: 18px;
                    line-height: 10px;
                    font-size: 0;
                    height: 10px;
                    .sell-count, .rating{
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .sell-count{
                        margin-right: 12px;
                    }
                }
                .price{
                    font-weight: 700;
                    line-height: 24px;
                    .noww{
                        margin-right: 8px;
                        font-size: 14px;
                        color: rgb(240, 20, 20)
                    }
                    .oldd{
                        text-decoration: line-through;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                }
                .cartcontrol-warpper{
                    position: absolute;
                    right: 12px;
                    bottom: 12px;
                }
                .buy{
                    position: absolute;
                    right: 18px;
                    bottom: 18px;
                    z-index: 10;
                    line-height: 24px;
                    padding: 0 12px;
                    box-sizing: border-box;
                    font-size: 10px;
                    border-radius: 12px;
                    color: #fff;
                    background: rgb(0, 160, 220);
                    &.fade-enter-active, &.fade-leave-active {
                        transition: all 0.1s ;
                        opacity: 1
                    };
                    &.fade-enter, &.fade-leave-to{
                        transition: all 0.1s ;
                        opacity: 0;
                    };
                }
            }
            .info{
                padding: 18px;
                .title{
                    line-height: 14px;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .text{
                    line-height: 24px;
                    color: rgb(77, 85, 93);
                    padding: 0 8px;
                    font-size: 12px;
                }
            }
            .rating{
                padding-top: 18px;
                .title{
                    line-height: 14px;
                    margin-left: 18px;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .rating-wrapper{
                    padding: 0 18px;
                    .rating-item{
                        position: relative;
                        padding: 16px 0;
                        @include border-1px(rgba(7,17,17, 0.1));
                        .user{
                            position: absolute;
                            right: 0;
                            top: 16px;
                            line-height: 12px;
                            font-size: 0;
                            .name{
                                display: inline-block;
                                vertical-align: top;
                                font-size: 10px;
                                color: rgb(147, 153, 159);
                                margin-right: 6px;
                            }
                            .avatar{
                                border-radius: 50%;
                            }
                        }
                        .time{
                            line-height: 12px;
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                            margin-bottom: 6px;
                        }
                        .text{
                            line-height: 16px;
                            font-size: 12px;
                            color: rgb(7, 17, 27);
                            .icon-thumb_down , .icon-thumb_up{
                                margin-right: 4px;
                                line-height: 16px;
                                font-size: 12px;
                            }
                            .icon-thumb_up{
                                color: rgb(0, 160, 220);
                            }
                            .icon-thumb_down{
                                color: rgb(77, 85, 93);
                            }
                        }
                    }
                    .no-rating{
                        padding: 16px 0;
                        font-size: 12px;
                        color: rgb(147, 153, 159);
                    }
                }
            }
        }
    }
</style>


