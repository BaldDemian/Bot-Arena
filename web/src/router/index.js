import {createRouter, createWebHistory} from "vue-router";
import PKIndexView from "@/views/pk/PKIndexView.vue";
import RecordIndexView from "@/views/record/RecordIndexView.vue";
import RankListIndexView from "@/views/ranklist/RankListIndexView.vue";
import UserBotIndexView from "@/views/user/bot/UserBotIndexView.vue";
import NotFound from "@/views/error/NotFound.vue";
import LoginIndexView from "@/views/account/LoginIndexView.vue";
import RegisterIndexView from "@/views/account/RegisterIndexView.vue";
import store from "@/store";

// path->view
const routes = [
    {
      // root path
      path: "/",
      name: "home",
      redirect: "/pk/",
      meta: {
          requestAuth: true
      }
    },
    {
        path: "/pk/",
        name: "pk_index",
        component: PKIndexView,
        meta: {
          requestAuth: true
        }
    },
    {
        path: "/record/",
        name: "record_index",
        component: RecordIndexView,
        meta: {
          requestAuth: true
        }
    },
    {
        path: "/ranklist/",
        name: "ranklist_index",
        component: RankListIndexView,
        meta: {
          requestAuth: true
        }
    },
    {
        path: "/user/bot/",
        name: "user_bot_index",
        component: UserBotIndexView,
        meta: {
          requestAuth: true
        }
    },
    {
        path: "/user/account/login/",
        name: "user_account_login",
        component: LoginIndexView,
        meta: {
          requestAuth: false
        }
    },
    {
        path: "/user/account/register/",
        name: "user_account_register",
        component: RegisterIndexView,
        meta: {
          requestAuth: false
        }
    },
    {
        path: "/404/",
        name: "404",
        component: NotFound,
        meta: {
          requestAuth: false
        }
    },
    {
        path: "/:catchAll(.*)",
        name: "not_found",
        redirect: "/404/"
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    console.log(to)
    console.log(store.state)
    if (!store.state.user.logged && to.meta.requestAuth) {
        next({name: 'user_account_login'})
    } else {
        next()
    }
})
export default router