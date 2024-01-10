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
        <!-- Always show the "Accueil" link -->
        <b-nav-item class="nav-item" :to="{ name: 'home' }">
          <b-icon-house-door-fill></b-icon-house-door-fill>
          Accueil
        </b-nav-item>

        <!-- Conditional rendering based on authentication state -->
        <b-nav-item v-if="!isAuthenticated" class="nav-item" :to="{ name: 'login' }">
          <b-icon-person-fill></b-icon-person-fill>
          Login
        </b-nav-item>
        <b-nav-item v-else @click="logout" class="nav-item">
          <b-icon-box-arrow-right></b-icon-box-arrow-right>
          Se déconnecter
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "navbarLayoutView",
  computed: {
    ...mapState(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
    async logout() {
      // Dispatch the Vuex logout action
      await this.$store.dispatch('logout');
      // Clear any additional user data stored locally, e.g., tokens
      localStorage.removeItem('token');
      // Redirect the user to the home page
      await this.$router.push('/');
      this.$router.go();
    },
  },
  data() {
    return {
      navbarColor: "#35a9a0"
    };
  }
}
</script>