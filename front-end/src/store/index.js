import {createStore} from "vuex";
import {def} from "@vue/shared";

export default createStore({
    state: {
        //user info
        loginUserInfo: null,
        //display login or not
        showLogin: false,
    },
    getters: {
        getLoginUserInfo: (state) => {
            return state.loginUserInfo;
        }
    },
    mutations: {
        updateLoginUserInfo(state, value) {
            state.loginUserInfo = value;
        },
        showLogin(state, value) {
            state.showLogin = value;
        }
    },
    actions: {},
    modules: {},
})