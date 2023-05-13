import {createStore} from "vuex";
import {def} from "@vue/shared";

export default createStore({
    state:{
        loginUserInfo:null,
    },
    getters:{
        getLoginUserInfo:(state)=>{
            return state.loginUserInfo;
        }
    },
    mutations:{
        updateLoginUserInfo(state,value) {
            state.loginUserInfo = value;
        }
    },
    actions:{},
    modules:{},
})