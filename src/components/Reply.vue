<template>
    <div class="replies my-3 " v-for="(reply, index) in commentReplies" :key="index">
        <div class="reply my-3 d-flex p-4 rounded gap-4 align-items-start position-relative">
            <div class="vote d-flex flex-column align-items-center p-3 gap-3 rounded">
                <svg class="plus" xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                    @click="$store.commit('increase_vote', reply)">
                    <path
                        d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                        fill="#C5C6EF" />
                </svg>
                <span class="fw-bold">{{ reply.score }}</span>
                <svg class="minus" xmlns="http://www.w3.org/2000/svg" width="11" height="3"
                    @click="$store.commit('decrease_vote', reply)">
                    <path
                        d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                        fill="#C5C6EF" />
                </svg>
            </div>
            <div class="details flex-fill">
                <div class="top d-flex align-items-center justify-content-between">
                    <div class="user-info d-flex align-items-center gap-3">
                        <img :src="reply.user.image.png" width="40" alt="">
                        <span class="name fw-bold">{{ reply.user.username }}</span>
                        <span class="you p-0 px-2 rounded"
                            v-if="reply.user.username === $store.state.currentUser.username">You</span>
                        <span class="time">{{ reply.createdAt }}</span>
                    </div>
                    <div :class="`control d-flex gap-4 align-items-center ${editReply.status === true && reply.id === tempUpdate.id ? 'd-none' : 'd-flex'}`"
                        v-if="reply.user.username === $store.state.currentUser.username">
                        <span class="del fw-bold" @click="confirmDelete(reply)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14">
                                <path
                                    d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                                    fill="#ED6368" />
                            </svg>
                            Delete
                        </span>
                        <span class="edit fw-bold" @click="confirmEdit(reply)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                                <path
                                    d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                                    fill="#5357B6" />
                            </svg>
                            Edit
                        </span>
                    </div>
                    <div class="reply" v-else @click="confirmReply(reply, index + 1)">
                        <img src="../assets/images/icon-reply.svg" alt="">
                        <span class="ms-2 fw-bold">Reply</span>
                    </div>
                </div>
                <p class="paragraph text-muted mt-3 mb-0 d-block" v-if="reply.id !== tempUpdate.id || !editReply.status">
                    <span class="mention fw-bold">@{{ reply.replyingTo }}, </span> {{
                        reply.content.match(/\s,?\w+/ig).join('')
                    }}
                </p>
                <form class="editing" v-if="reply.id === tempUpdate.id && editReply.status"
                    @submit.prevent="$store.dispatch('applyReplyUpdate', { tempUpdate, editReply })">
                    <textarea class="w-100 p-2 mt-3 px-3 rounded" name="editing" style="resize: none; height: 100px;"
                        v-model="tempUpdate.content"></textarea>
                    <button class="btn mt-2 text-light text-uppercase">Update</button>
                </form>
            </div>
        </div>
        <Form v-if="replying && reply.user.username === mention" :replyMention="mention"
            @finish-reply="() => replying = false"></Form>
    </div>
    <DeletePopup v-if="deleteReplyPopup" :deleteReplyPopup="deleteReplyPopup" @close-popup="() => deleteReplyPopup = false"
        :tempDelete="tempDelete"></DeletePopup>
</template>
<script setup>
import { ref } from 'vue';
import DeletePopup from './DeletePopup.vue';
import Form from './Form.vue';
defineProps(['commentReplies'])

const deleteReplyPopup = ref(false)
const replying = ref(false)
const mention = ref('')

const editReply = ref({
    status: false
})
const tempDelete = ref({
    id: '',
})

const tempUpdate = ref({
    id: '',
    content: ''
})
let confirmDelete = (reply) => {
    deleteReplyPopup.value = true
    tempDelete.value.id = reply.id
}
let confirmEdit = (reply) => {
    editReply.value.status = true
    tempUpdate.value.id = reply.id
    tempUpdate.value.content = reply.content
}
let confirmReply = (reply, index) => {
    if (reply.user.username) {
        console.log('a7a');
        replying.value = true
        mention.value = reply.user.username
    }
}

</script>
<style lang="scss" scoped>
@import '../Variables';

.replies {
    .reply {
        background-color: $White;

        @media (max-width: 767px) {
            flex-direction: column-reverse;
        }

        .vote {
            background-color: $VeryLightGray;

            svg {
                cursor: pointer;

                & path {
                    transition: 0.2s;
                }

                &:hover path {
                    fill: $ModerateBlue;
                }
            }

            span {
                color: $ModerateBlue;
                user-select: none;
            }

            @media (max-width: 767px) {
                flex-direction: row !important;
                padding: 10px 20px !important;
            }
        }

        .details {
            .top {
                .user-info {
                    .name {
                        color: $DarkBlue;
                    }

                    .you {
                        background-color: $ModerateBlue;
                        color: $White;
                    }

                    .time {
                        color: $GrayishBlue;
                        font-size: 13px;
                    }
                }

                .control {
                    span {
                        cursor: pointer;
                        transition: 0.3s;

                        &:hover {
                            opacity: 0.5;
                        }
                    }

                    .del {
                        color: $SoftRed;
                    }

                    .edit {
                        color: $ModerateBlue;
                    }

                    @media (max-width: 767px) {
                        position: absolute;
                        bottom: 35px;
                        right: 25px;
                    }
                }

                .reply {
                    cursor: pointer;
                    transition: 0.2s;

                    &:hover {
                        opacity: 0.5;
                    }

                    span {
                        color: $ModerateBlue;
                    }

                    @media (max-width: 767px) {
                        position: absolute;
                        bottom: 35px;
                        right: 25px;
                    }
                }

            }

            .paragraph {
                color: $DarkBlue;

                .mention {
                    color: $ModerateBlue;
                }
            }

            .editing {
                textarea {
                    border: 1px solid $LightGray;
                    outline: none;
                }

                button {
                    transition: 0.2s;
                    background-color: $ModerateBlue;
                    display: block;
                    margin-left: auto;

                    &:hover {
                        opacity: 0.5;
                    }
                }
            }
        }
    }

}
</style>