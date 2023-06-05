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
        //message amount
        messageCountInfo: {},
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
        },
        getMessageCountInfo: (state) => {
            return state.messageCountInfo;
        },
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
        //config message amount
        updateMessageCountInfo: (state, value) => {
            state.messageCountInfo = value;
        },
        readMessage: (state, value) => {
            state.messageCountInfo.total = state.messageCountInfo.total - state.messageCountInfo[value]
            state.messageCountInfo[value] = 0;
        },
        saveSysSetting: (state, value) => {
            state.sysSetting = value;
        }
    },
    actions: {},
    modules: {},
})