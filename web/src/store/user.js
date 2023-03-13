// used to store user info
import $ from 'jquery'
export default {
    state: {
        id: "",
        name: "",
        photo: "",
        jwt: "",
        logged: false,
        pulling: true
    },
    getters: {

    },
    // commit
    // sync methods
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
        },
        updatePulling(state, pulling) {
            state.pulling = pulling
        }
    },
    // dispatch.
    // Async methods can only be put in actions
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
                        localStorage.setItem("jwt", resp.jwt)
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
            localStorage.removeItem("jwt")
            context.commit("logout")
        },

        register(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/register/",
                type: "post",
                data: {
                    name: data.name,
                    password: data.password,
                    confirmedPassword: data.confirmedPassword,
                },
                success(resp) {
                    if (resp.code === "100") {
                        //console.log("success!");
                        data.success()
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            })
        }

    },
    modules: {

    },
}