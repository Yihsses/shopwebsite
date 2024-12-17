<template>
    <div class="flex w-screen h-screen bg-gradient-to-tr from-blue-700 to-rose-400">
        <HeadMenu />
        <LoginComp class="m-auto"/>
    </div>
</template>

<script>


import HeadMenu from '../components/HeadMenu.vue'
import LoginComp from '@/components/LoginComp.vue';


export default {
    name: 'MemberView',
    components: {
        HeadMenu, LoginComp
    },
    data() {

    },
    methods: {
      
    }
}
</script>

<style scope>
.login-form-container {
    position: relative;
    top: 200px;
    margin: 0px 0px;

}

.login-form-container h1 {
    font-size: 50px;
    color: black;
    font-weight: 400;
}

.input__field {
    width: 80%;
    /* 设置宽度为父容器的 80% */
    max-width: 400px;
    /* 最大宽度限制 */
    padding: 12px 15px;
    /* 输入框内边距 */
    font-size: 16px;
    /* 字体大小 */
    border: 1px solid #ccc;
    /* 边框颜色和样式 */
    border-radius: 5px;
    /* 圆角效果 */
    margin: 10px 0;
    /* 输入框之间的间距 */
    box-sizing: border-box;
    /* 确保 padding 不影响宽度 */
}

.input__field:focus {
    border-color: #007bff;
    /* 聚焦时改变边框颜色 */
    outline: none;
    /* 去除默认的聚焦边框 */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    /* 添加阴影效果 */
}

.button {
    width: 80%;
    /* 设置宽度为父容器的 80% */
    max-width: 400px;
    /* 最大宽度限制 */
    font-weight: 900;
    font-size: 20px;
    background-color: #9954f3;
    color: white !important;
    border: none;
    padding: 12px 20px;

    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}


#entry-title {
    margin: 40px 0;
}

.Common_Subtitle_Text {
    font-size: 25px;
    color: black;
    font-weight: 400;
    padding: 0px 20px, 0px;
}

.login-form-container hr {
    width: 30%;
    text-align: center;
    margin: 25px auto;
    text-align: right;
    border: 0;
    border-top: 2px solid #e7e7e7;
    /* 顏色較淺的灰色 */

}

.register {
    margin: 25px auto;
    width: 80%;
    /* 设置宽度为父容器的 80% */
    max-width: 400px;
    /* 最大宽度限制 */
    font-weight: 900;
    font-size: 20px;
    background-color: #9954f3;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
</style>