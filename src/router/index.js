import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Addsmoothie from '../components/addSmoothie'
import EditSmoothie from '../components/editSmoothie'

const routes = [{
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/addsmoothie",
        name: "addsmoothie",
        component: Addsmoothie
    },
    {
        path: "/:id",
        name: "editSmoothie",
        component: EditSmoothie,
        props: true
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router