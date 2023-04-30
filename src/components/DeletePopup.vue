<template>
    <div class="overlay position-fixed d-flex align-items-center justify-content-center">
        <div class="popup p-4 rounded">
            <h3>Delete Comment</h3>
            <p>Are you sure you want to delete this comment? This Will remove the comment and can't be undone</p>
            <div class="d-flex align-items-center justify-content-between">
                <button class="yes btn px-4 text-uppercase p-2 text-light" @click="$emit('close-popup')">No, Cancel</button>
                <button class="no btn px-4 p-2 text-uppercase text-light"
                    @click="$store.dispatch('deleteReply', tempDelete) & $emit('close-popup')" v-if="deleteReplyPopup">Yes, Delete</button>
                <button class="no btn px-4 p-2 text-uppercase text-light"
                    @click="$store.dispatch('deleteComment', tempDelete) & $emit('close-popup')" v-else>Yes, Delete</button>
            </div>
        </div>
    </div>
</template>
<script setup>
defineEmits(['close-popup', 'delete-comment'])
defineProps(['tempDelete', 'deleteReplyPopup'])
</script>
<style lang="scss" scoped>
@import '../Variables';

.overlay {
    background-color: #00000049;
    width: 100%;
    height: 100%;
    z-index: 555555;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .popup {
        width: 350px;
        background-color: $White;

        h3 {
            color: $DarkBlue;
        }

        p {
            color: $GrayishBlue;
        }

        button {
            &.yes {
                background-color: $SoftRed;
            }

            &.no {
                background-color: $GrayishBlue;
            }
        }
    }
}</style>