import Vue from 'vue'
import Router from 'vue-router'
import Tasks from './components/Tasks.vue'
import LoginView from './components/LoginView.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/tasks',
            name: 'tasks',
            component: Tasks
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        }
    ]
})
