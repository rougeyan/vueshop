<template>
    <div class="cartcontrol">
        <transition name="fade">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreasecart">
                <!-- @click.stop.prevent 阻止事件冒泡 既会进入food 又会加1 -->
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <transition name="inne">
            <div class="count" v-show="food.count>0">{{food.count}}
            </div>
        </transition>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>
 <script type="text/ecmascript-6">
import Vue from 'vue';
import Bus from '../../common/bus';
export default {
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        // 增加按钮;
        addCart (event) {
            // 通过betterscroll派发事件的,没引用betterscroll 默认return;
            if (!event._constructed) {
                return;
            }
            // 假如以上注释掉虽然是允许 但是PC端触发三次;
            // !0 的逻辑值为true 即当=0时候
            if (!this.food.count) {
                // 全局 set "这个"对象 count属性的 值为1
                // Vue.set 的作用就是在构造器外部操作构造器内部的数据、属性或者方法。
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count++;
            }
            // 不同组件通讯;步骤: 传给good,good传给 shopcar, 复杂的话要用vuex;
            // 'getTarget' 只是名字 任意的都可以
            Bus.$emit('getTarget', event.target);
        },
        // 减少按钮;
        decreasecart (event) {
            if (!event._constructed) {
                return;
            }
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
    .cartcontrol{
        font-size: 0;
        .cart-decrease{
            padding: 6px;
            display: inline-block;
            &.fade-enter-active, &.fade-leave-active {
                transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
                .inner{
                    transition: all .4s linear;
                    transform: rotate(0);
                }
            }
            &.fade-enter, &.fade-leave-to {
                transform: translateX(36px);
                .inner{
                    transform: rotate(180deg);
                    opacity: 0;
                }
            }
            .inner{
                display: inline-block;
                line-height: 24px;
                font-size: 24px;
                color: rgb(0, 160, 220);
            }
        }
        .count{
            display: inline-block;
            font-size: 12px;
            width: 12px;
            line-height: 24px;
            text-align: center;
            color: rgb(147, 153, 159);
            vertical-align: top;
            padding-top: 6px;
            font-weight: 700;
            &.inne-enter-active, &.inne-leave-active {
                transition: all .6s ease;
                opacity: 1
            }
            &.inne-enter, &.inne-leave-to{
                opacity: 0;
            }
        }
        .cart-add{
                padding: 6px;
                display: inline-block;
                line-height: 24px;
                font-size: 24px;
                color: rgb(0, 160, 220);
        }
    }
</style>

