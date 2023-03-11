// used to store user info
import $ from 'jquery'
export default {
    state: {
        id: "",
        name: "",
        photo: "",
        jwt: "",
        logged: false,
    },
    getters: {

    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id
            state.name = user.name
            state.photo = user.photo
            state.jwt = user.jwt
            state.logged = user.logged
        },
        updateToken(state, token) {
            state.jwt = token
        },
        logout(state) {
            state.id = ""
            state.name = ""
            state.photo = ""
            state.jwt = ""
            state.logged = false
        }
    },
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/token/",
                type: "post",
                data: {
                    name: data.name,
                    password: data.password
                },
                success(resp) {
                    if (resp.msg === "success") {
                        context.commit("updateToken", resp.jwt)
                        data.success(resp)
                    } else {
                        data.error(resp)
                    }
                },
                error(resp) {
                    data.error(resp)
                }
            })
        },

        // send token to backend and get user info
        getInfo(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/info/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + context.state.jwt,
                },
                success(resp) {
                    if (resp.msg === "success") {
                        // load user info into context
                        context.commit("updateUser", {
                            ...resp, // resolve all parameters in resp
                            /* ...resp:
                             * id: resp.id
                             * name: resp.name
                             * photo: resp.photo
                             */
                            logged: true
                        });
                        data.success()
                    } else {
                        data.error(resp)
                    }
                },
                error(resp) {
                    data.error(resp)
                }
            })
        },

        logout(context) {
            context.commit("logout")
        }

    },
    modules: {

    },
}