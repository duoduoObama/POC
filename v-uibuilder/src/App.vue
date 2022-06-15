<script setup lang="ts">
import { ref } from "vue";
const name = ref("");
const changeName = (val: string) => {
  name.value = val;
};
</script>

<template>
  <div>
    <h1>Hello {{ name }}</h1>
    <button @click="changeName('duoduo')">Change Name</button>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
