<template>
  <main class="container py-5 min-vh-100 px-5">
    <div class="comments">
      <Comment></Comment>
    </div>
    <Form></Form>
  </main>
</template>
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import Comment from './components/Comment.vue';
import Form from './components/Form.vue';
import store from './store/index'


onBeforeMount(() => {
  store.dispatch('fetchCurrentUser')
})

</script>
<style lang="scss">
@import './Variables';

* {
  box-sizing: border-box;
}

body {
  font-size: 16px;
  font-family: 'Rubik', sans-serif;
  background-color: $VeryLightGray;
}
@media (max-width: 991px) {
  .container {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
</style>