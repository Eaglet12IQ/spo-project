import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import './style.css'
import App from './App.vue'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import Stamps from './views/Stamps.vue'
import StampDetail from './views/StampDetail.vue'
import Collectors from './views/Collectors.vue'
import CollectorDetail from './views/CollectorDetail.vue'
import Collections from './views/Collections.vue'
import CollectionDetail from './views/CollectionDetail.vue'
import NotFound from './views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/profiles/:collector_id', component: Profile },
    { path: '/stamps', component: Stamps },
    { path: '/stamps/:id', component: StampDetail },
    { path: '/collectors', component: Collectors },
    { path: '/collectors/:id', component: CollectorDetail },
    { path: '/collections', component: Collections },
    { path: '/collections/:id', component: CollectionDetail },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(MotionPlugin)
app.mount('#app')