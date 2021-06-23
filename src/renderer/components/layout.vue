<!--
 * @Author: your name
 * @Date: 2021-06-21 17:39:45
 * @LastEditTime: 2021-06-23 10:35:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /upyun-tool/src/renderer/components/layout.vue
-->
<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <div class="logo">YUPOO TOOL</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <a-icon type="calculator" />
          <router-link to="/parse">解析</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="area-chart" />
          <router-link to="/show">展示</router-link>
        </a-menu-item>
        <!-- <a-menu-item key="3">
          nav 3
        </a-menu-item> -->
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>One</a-breadcrumb-item>
        <a-breadcrumb-item>Two</a-breadcrumb-item>
        <a-breadcrumb-item>Three</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="content">
        <router-view></router-view>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Electron + Vue ©2021 Created by LQM
    </a-layout-footer>
  </a-layout>
</template>
<style lang="less" scoped>
#components-layout-demo-top .logo {
  width: 120px;
  height: 31px;
  text-align: center;
  color: #fff;
  line-height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
.ant-layout {
  height: 100vh;
  .ant-layout-content {
    display: flex;
    flex-direction: column;
  }
  .ant-layout-footer {
    padding: 14px 50px;
    font-size: 13px;
  }
}
.ant-menu-dark.ant-menu-horizontal > .ant-menu-item {
  a {
    display: inline-block;
  }
}
.content {
  flex: 1 1 auto;
  background: #fff;
  padding: 24px; 
  // height: 100%;
  overflow: scroll;
}
</style>
