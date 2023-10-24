<template>
  <b-navbar class="navbar navbar-expand-lg navbar justify-content-between" toggleable="lg" :style="{ backgroundColor: navbarColor }">
    <b-navbar-brand href="/" class="ms-3">
      <img href="/"
           src="../../../../../visualisation/frontend/public/icon.png"
           alt="LOGO" width="40" height="40" class="d-inline-block rounded align-text-top">
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item class="nav-item" :to="{ name: 'home' }">
            <b-icon-house-door-fill></b-icon-house-door-fill>
            Accueil
        </b-nav-item>
        <b-nav-item class="nav-item" :to="{ name: 'login' }">
          <template>
            <b-icon-person-fill></b-icon-person-fill>
            Login
          </template>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      navbarColor: "#35a9a0"
    };
  }

}
</script>

<style scoped>

</style>

