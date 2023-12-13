<template>
  <div class="app-container">
    <div id="bg-wrap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
            <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stop-color="rgba(127, 219, 232, 0.2)"></stop>
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"></stop>
          </radialGradient>

          <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
            <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stop-color="rgba(53, 169, 160, 0.2)"></stop>
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"></stop>
          </radialGradient>

          <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
            <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stop-color="rgb(48, 139, 244, 0.2)"></stop>
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"></stop>
          </radialGradient>

          <radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5">
            <animate attributeName="fx" dur="23s" values="0%;5%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stop-color="rgba(98, 224, 127, 0.2)"></stop>
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"></stop>
          </radialGradient>

          <radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5">
            <animate attributeName="fx" dur="24.5s" values="0%;5%;0%" repeatCount="indefinite"></animate>
            <stop offset="0%" stop-color="rgb(54, 163, 149,0.2)"></stop>
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"></stop>
          </radialGradient>
        </defs>

        <rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)"
              transform="rotate(334.41 50 50)">
          <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite"></animate>
          <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite"></animate>
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s"
                            repeatCount="indefinite"></animateTransform>
        </rect>
        <rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)"
              transform="rotate(255.072 50 50)">
          <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite"></animate>
          <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite"></animate>
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s"
                            repeatCount="indefinite"></animateTransform>
        </rect>
        <rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)"
              transform="rotate(139.903 50 50)">
          <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite"></animate>
          <animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite"></animate>
          <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s"
                            repeatCount="indefinite"></animateTransform>
        </rect>
      </svg>
    </div>

    <div class="container">
      <ErrorComponent :error="loginError" @errorHandled="clearError" />

      <div class="justify-content-center"><h1 class="card-title text-center p-3">LOGIN</h1></div>
      <div class="d-flex justify-content-center align-items-center">
        <div class="col-md-4">
          <div class="card" :class="{ 'animate-on-load': animateCard }">
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="form-group p-1">
                  <label class="justify-content-center label" for="email">Email</label>
                  <input type="email" class="form-control" id="email" placeholder="Entrez votre email"
                         v-model="email" required>
                </div>
                <div class="form-group">
                  <label class="justify-content-center label" for="password">Password</label>
                  <input type="password" class="form-control" id="password"
                         placeholder="Entrez votre mot de passe" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-block button">SE CONNECTER</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ErrorComponent from "@/components/ErrorComponent.vue";

export default {
  name: "LoginView",
  components: {
    ErrorComponent
  },
  data() {
    return {
      email: null,
      password: null,
      loginError: '',
      animateCard: false,
    };
  },
  methods: {
    async login() {
      try {
        const userData = await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        });

        await this.$router.push({ name: 'cobaye', params: { nomCobaye: userData.user.name } });
        this.loginError = '';

      } catch (error) {
        if (error.response && error.response.data) {
          this.loginError = error.response.data.message;
        } else {
          this.loginError = "Error during login. Please try again.";
        }
        console.error("Error in login() LoginView:", error);
      }
    },
    clearError() {
      this.error = null;
    }
  },
  mounted() {
    this.animateCard = true;
  },
}
</script>

<style>
@import '../../public/css/login.css';
</style>
