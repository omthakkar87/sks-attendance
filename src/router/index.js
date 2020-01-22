import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import StudentProfile from '@/components/StudentProfile'
import SignUp from '@/components/SignUp'
import StudentHome from '@/components/StudentHome'
import FacultyHome from '@/components/FacultyHome'
import Mark from '@/components/Mark'
import Take from '@/components/Take'
import Session from '@/components/Session'
import StudentReport from '@/components/StudentReport'
import ClassReport from '@/components/ClassReport'

Vue.use(VueRouter)

const routes = [
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
    path: '/StudentProfile',
    name: 'StudentProfile',
    component: StudentProfile
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
