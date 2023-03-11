import {createRouter, createWebHistory} from "vue-router";
import PKIndexView from "@/views/pk/PKIndexView.vue";
import RecordIndexView from "@/views/record/RecordIndexView.vue";
import RankListIndexView from "@/views/ranklist/RankListIndexView.vue";
import UserBotIndexView from "@/views/user/bot/UserBotIndexView.vue";
import NotFound from "@/views/error/NotFound.vue";
import LoginIndexView from "@/views/account/LoginIndexView.vue";
import RegisterIndexView from "@/views/account/RegisterIndexView.vue";

// path->view
const routes = [
    {
      // root path
      path: "/",
      name: "home",
      redirect: "/pk/"
    },
    {
        path: "/pk/",
        name: "pk_index",
        component: PKIndexView,
    },
    {
        path: "/record/",
        name: "record_index",
        component: RecordIndexView,
    },
    {
        path: "/ranklist/",
        name: "ranklist_index",
        component: RankListIndexView,
    },
    {
        path: "/user/bot/",
        name: "user_bot_index",
        component: UserBotIndexView
    },
    {
        path: "/user/account/login/",
        name: "user_account_login",
        component: LoginIndexView
    },
    {
        path: "/user/account/register/",
        name: "user_account_register",
        component: RegisterIndexView
    },
    {
        path: "/404/",
        name: "404",
        component: NotFound,
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

export default router