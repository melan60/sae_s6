<template>
  <div>
    <h1>ScientifiqueHome</h1>
    <div v-if="userInfo">
      <p>Name: {{ userInfo.name }}</p>
      <p>Email: {{ userInfo.email }}</p>
    </div>
  </div>
</template>


<script>
  import axios from "axios";

  export default {
    name: "ScientifiqueHome",
    data() {
      return {
        userInfo: null,
      };
    },
    async created() {
      try {
        const nomScientifique = this.$route.params.nomScientifique;
        const response = await axios.get(`/api/scientifique/${nomScientifique}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        this.userInfo = response.data.user;
        console.log('User info:', this.userInfo);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }
</script>
<style scoped>

</style>