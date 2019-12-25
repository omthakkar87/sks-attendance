import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import StudentHome from '@/components/StudentHome'
import FacultyHome from '@/components/FacultyHome'
import Mark from '@/components/Mark'
import Take from '@/components/Take'
import Session from '@/components/Session'
import StudentReport from '@/components/StudentReport'
import ClassReport from '@/components/ClassReport'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/StudentHome',
      name: 'StudentHome',
      component: StudentHome
    },
    {
      path: '/FacultyHome',
      name: 'FacultyHome',
      component: FacultyHome
    },
    {
      path: '/Mark/:sessionid',
      name: 'Mark',
      component: Mark
    },
    {
      path: '/Take',
      name: 'Take',
      component: Take
    },
    {
      path: '/Session/:sessionid',
      name: 'Session',
      component: Session
    },
    {
      path: '/StudentReport',
      name: 'StudentReport',
      component: StudentReport
    },
    {
      path: '/ClassReport',
      name: 'ClassReport',
      component: ClassReport
    }
  ]
})
