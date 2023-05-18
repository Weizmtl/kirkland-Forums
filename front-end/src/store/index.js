import {createStore} from "vuex";
import {def} from "@vue/shared";

export default createStore({
    state: {
        //user info
        loginUserInfo: null,
        //display login or not
        showLogin: false,
        //Boards info
        boardList: [],
        //current primary board
        activePboardId: 0,
        //current secondary board
        activeBoardId: 0,
    },
    getters: {
        getLoginUserInfo: (state) => {
            return state.loginUserInfo;
        },
        getBoardList: (state) => {
            return state.boardList;
        },
        getSubBoardList: (state) => (boardId) => {
            let board = state.boardList.find(item => {
                return item.boardId == boardId;
            })
            return board ? board.children : [];
        }, getactivePboardId: (state) => {
            return state.activePboardId;
        },
        getActiveBoardId: (state) => {
            return state.activeBoardId;
        }
    },
    mutations: {
        updateLoginUserInfo(state, value) {
            state.loginUserInfo = value;
        },
        showLogin(state, value) {
            state.showLogin = value;
        },
        saveBoardList(state, value) {
            state.boardList = value;
        }, setActivePboardId: (state, value) => {
            state.activePboardId = value;
        }, setActiveBoardId: (state, value) => {
            state.activeBoardId = value;
        },
    },
    actions: {},
    modules: {},
})