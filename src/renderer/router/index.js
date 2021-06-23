/*
 * @Author: your name
 * @Date: 2021-06-21 16:12:55
 * @LastEditTime: 2021-06-23 10:17:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /upyun-tool/src/renderer/router/index.js
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      redirect: '/parse',
      component: () => import('@/components/layout'),
      children: [
        {
          path: '/parse',
          name: 'parse-page',
          component: () => import('@/page/parse')
        },
        {
          path: '/show',
          name: 'show-page',
          component: () => import('@/page/show')
        }
      ]

    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
