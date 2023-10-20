<template>
  <div id="app">
    <navbar-layout/>
    <router-view/>
  </div>
</template>

<script>
import navbarLayout from "@/views/layout/navbarLayout.vue";

export default {
  name: "app",
  components: {
    'navbar-layout': navbarLayout,
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Nunito&family=Work+Sans&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}
</style>
