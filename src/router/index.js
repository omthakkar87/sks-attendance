import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import StudentProfile from '@/components/StudentProfile'
import StudentSignUp from '@/components/StudentSignUp'
import FacultySignUp from '@/components/FacultySignUp'
import StudentHome from '@/components/StudentHome'
import FacultyHome from '@/components/FacultyHome'
import AdminHome from '@/components/AdminHome'
import Mark from '@/components/Mark'
import Take from '@/components/Take'
import Session from '@/components/Session'
import Edit from '@/components/Edit'
import StudentReport from '@/components/StudentReport'
import ClassReport from '@/components/ClassReport'
import FacultyManage from '@/components/FacultyManage'
import AdminAttendance from '@/components/AdminAttendance'
import AdminSession from '@/components/AdminSession'

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
    path: '/StudentSignUp',
    name: 'StudentSignUp',
    component: StudentSignUp
  },
  {
    path: '/FacultySignUp',
    name: 'FacultySignUp',
    component: FacultySignUp
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
    path: '/FacultyManage',
    name: 'FacultyManage',
    component: FacultyManage
  },
  {
    path: '/AdminHome',
    name: 'AdminHome',
    component: AdminHome
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
    path: '/Edit/:edittype',
    name: 'Edit',
    component: Edit
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
  },
  {
    path: '/AdminAttendance',
    name: 'AdminAttendance',
    component: AdminAttendance
  },
  {
    path: '/AdminSession',
    name: 'AdminSession',
    component: AdminSession
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
