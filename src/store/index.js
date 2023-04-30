import { createStore } from "vuex";

const store = createStore({
    state: {
        currentUser: {},
        comments: [],
        pngPic: ''
    },
    mutations: {
        set_user(state, user) {
            state.currentUser = user
        },
        set_comments(state, comment) {
            state.comments = comment
        },
        set_pic(state, userPic) {
            state.pngPic = userPic
        },
        increase_vote(state, comment) {
            comment.score++
        },
        decrease_vote(state, comment) {
            if (comment.score === 0) {
                return
            } else comment.score--
        },
        delete_comment(state, comment) {
            state.comments = state.comments.filter(el => el.id !== comment.id)
        },
        apply_update(state, { tempUpdate, edit }) {
            state.comments.forEach(el => {
                if (el.id === tempUpdate.id) {
                    el.content = tempUpdate.content
                    edit.status = false
                }
            })
        },
        delete_reply(state, reply) {
            state.comments.forEach(el => {
                el.replies = el.replies.filter(el => el.id !== reply.id)
            }) 
        },
        update_reply(state, { tempUpdate, editReply }) {
            state.comments.forEach(el => {
                el.replies.forEach(el => {
                    if (el.id === tempUpdate.id) {
                        el.content = tempUpdate.content
                    }
                })
                editReply.status = false
            })
        }
    },
    actions: {
        fetchCurrentUser({ commit }) {
            fetch('/data.json').then(response => response.json()).then(data => {
                commit('set_user', data.currentUser)
                commit('set_comments', data.comments)
                commit('set_pic', data.currentUser.image.png)
            })
        },
        deleteComment({ commit }, comment) {
            commit('delete_comment', comment)
        },
        applyUpdate({ commit }, { tempUpdate, edit }) {
            commit('apply_update', { tempUpdate, edit })
        },
        deleteReply({ commit }, reply) {
            commit('delete_reply', reply)
        },
        applyReplyUpdate({ commit }, {tempUpdate, editReply}) {
            commit('update_reply', {tempUpdate, editReply})
        }
    }
})

export default store