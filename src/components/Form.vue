<template>
    <form class="reply current-user p-4 rounded d-flex align-items-start gap-3 position-relative"
        @submit.prevent="replyToReplySubmission" v-if="replyMention">
        <img :src="$store.state.pngPic" alt="" width="40">
        <textarea class="w-100 p-2 px-3 rounded" name="comment" style="resize: none; height: 100px;"
            placeholder="Add comment..." v-model="replyingMention" v-if="replyMention"></textarea>
        <button class="butn-shape btn px-4">Send</button>
    </form>
    <form class="reply current-user p-4 rounded d-flex align-items-start gap-3 position-relative"
        @submit.prevent="replySubmission" v-else-if="mention">
        <img :src="$store.state.pngPic" alt="" width="40">
        <textarea class="w-100 p-2 px-3 rounded" name="comment" style="resize: none; height: 100px;"
            placeholder="Add comment..." v-model="mentionMessage" v-if="mention"></textarea>
        <button class="butn-shape btn px-4">Send</button>
    </form>
    <form class="current-user p-4 rounded d-flex align-items-start gap-3 position-relative" @submit.prevent="submission"
        v-else>
        <img :src="$store.state.pngPic" alt="" width="40">
        <textarea class="w-100 p-2 px-3 rounded" name="comment" style="resize: none; height: 100px;"
            placeholder="Add comment..." v-model="currentUserComment"></textarea>
        <button class="butn-shape btn px-4">Send</button>
    </form>
</template>
<script setup>
import { ref } from 'vue';
import store from '../store';
const props = defineProps(['mention', 'reply', 'replying', 'replyMention'])
const emits = defineEmits(['finish-reply'])
const currentUserComment = ref('')

const mentionMessage = ref(`@${props.mention}, `)
const replyingMention = ref(`@${props.replyMention}, `)

let replyToReplySubmission = () => {
    store.state.comments.forEach(el => {
        el.replies.forEach(element => {
            if (element.user.username === props.replyMention) {
                let maxLength = []
                let identifier = ''
                store.state.comments.forEach(el => {
                    el.replies.forEach(ele => {
                        maxLength.push(ele.id)
                        identifier = Math.max(...maxLength) + 1
                    })
                })
                el.replies.push({
                    id: identifier,
                    content: replyingMention.value,
                    createdAt: new Date().toLocaleTimeString(),
                    replyingTo: props.replyMention,
                    score: 0,
                    user: {
                        image: {
                            png: store.state.pngPic
                        },
                        username: store.state.currentUser.username
                    },
                })
                replyingMention.value = ''
                emits('finish-reply')
            }
        })
    })
}

let replySubmission = () => {
    store.state.comments.forEach(el => {
        if (el.user.username === props.mention) {
            let maxLength = []
            let identifier = ''
            store.state.comments.forEach(el => {
                el.replies.forEach(ele => {
                    maxLength.push(ele.id)
                    identifier = Math.max(...maxLength) + 1
                })
            })
            el.replies.push({
                id: identifier,
                content: mentionMessage.value,
                createdAt: new Date().toLocaleTimeString(),
                replyingTo: props.mention,
                score: 0,
                user: {
                    image: {
                        png: store.state.pngPic
                    },
                    username: store.state.currentUser.username
                },
            })
            mentionMessage.value = ''
            emits('finish-reply')
        }
    })
}


let submission = () => {
    store.state.comments.push({
        id: store.state.comments[store.state.comments.length - 1].id + 1,
        content: currentUserComment.value,
        createdAt: new Date().toLocaleTimeString(),
        score: 0,
        user: {
            image: {
                png: store.state.pngPic
            },
            username: store.state.currentUser.username
        },
        replies: []
    })
    currentUserComment.value = ''
}

</script>
<style lang="scss" scoped>
@import '../Variables';

.current-user {
    background-color: $White;

    textarea {
        border: 1px solid $LightGray;
        outline: none;
    }

    .butn-shape {
        background-color: $ModerateBlue;
        color: $White;
        text-transform: uppercase;
        padding: 10px 0;
        transition: 0.3s;

        &:hover {
            opacity: 0.5;
        }
    }

    @media (max-width: 767px) {
        flex-direction: column-reverse;

        .butn-shape {
            position: absolute;
            right: 25px;
            bottom: 20px;
        }
    }
}
</style>