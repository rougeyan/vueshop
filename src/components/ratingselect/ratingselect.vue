<template>
    <div class="ratingselect">
        <div class="ratingtype border-1px">
            <span @click="select(2,$event)" class="block positive" :class="{'active':sType === 2}">{{desc.all}}<span class="count">{{rating.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':sType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':sType === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on':oContent}" >
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
 <script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
    data () {
        return {
            // 自定义事件
            // 该步骤为了子组件影响 向父组件通讯影响子父组件状态
            // 再次启用时, 已经无法被覆盖 无法定义?
            // 只适用于 初次 获取;?
            // 但是如何重刷新伏组件状态?
            sType: this.selectType,
            oContent: this.onlyContent
        };
    },
    props: {
        rating: {
            type: Array,
            default () {
                return [];
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default () {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                };
            }
        }
    },
    computed: {
        positives () {
            return this.rating.filter((rating) => {
                return rating.rateType === POSITIVE;
            });
        },
        negatives () {
            return this.rating.filter((rating) => {
                return rating.rateType === NEGATIVE;
            });
        }
    },
    methods: {
        // 选择type 跟onlycontent传到父组件;
        // 刷新
        refish () {
            this.sType = ALL;
            this.oContent = false;
        },
        select (type, event) {
            if (!event._constructed) {
                return;
            };
            this.sType = type;
            // console.log('点击后子组件中sType为' + this.sType);
            // console.log('点击后子组件中selectType为' + this.selectType + '并未传入父组件');
            // 触发 自定义ratingtye.select 事件时,附加参数type 传给监听器回调
            this.$emit('select-type', type);
        },
        toggleContent (event) {
            // 来回切换 打勾与打岔
            if (!event._constructed) {
                return;
            }
            this.oContent = !this.oContent;
            console.log('ratingselect组件的this.oContent是' + this.oContent);
            this.$emit('toggle-content', this.oContent);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../common/mixin.scss';
.ratingselect{
    .ratingtype{
        padding: 18px 0;
        margin: 0 18px;
        @include border-1px(rgba(7,17,27,.1));
        font-size: 0;
        .block{
            display: inline-block;
            padding: 8px 12px;
            margin-right: 8px;
            border-radius: 1px;
            color: rgb(77, 85, 93);
            font-size: 12px;
            &.active{
                color:#fff;
                .count{
                    font-size: 8px;
                    margin-left: 2px;
                    // line-height 设置16 显得方块高一点 active 的时候
                    line-height: 16px;
                }
            }
            &.positive{
                background: rgba(0,160,220,0.2);
                &.active{
                    background: rgb(0,160,220);
                }
            }
            &.negative{
                background: rgba(77,85,93,0.2);
                &.active{
                    background:rgb(77,85,93);
                }
            }
        }
    }
    .switch{
        padding: 12px 18px;
        line-height: 24px;
        border-bottom: 1px solid rgba(7,17,27,.1);
        color: rgb(147, 153, 159);
        font-size: 0;
        &.on{
            .icon-check_circle{
                color: #00c850;
            }
        }
        .icon-check_circle{
            display: inline-block;
            margin-right: 4px;
            font-size: 24px;
        }
        .text{
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
        }
    }
}
</style>
