<template>
<b-container fluid style="border-radius: 20px;
        margin-right: 200px;
        margin-left: 200px;
        background-color: white;
         ">
  <b-row align-h="center">
    Se connecter
  </b-row>
<!--  submit & reset -->
  <b-form>
    <b-form-group label="Email">
      <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Saisir email"
          required
      ></b-form-input>
    </b-form-group>

    <b-form-group label="Password">
      <b-form-input
          id="input-1"
          v-model="form.password"
          type="password"
          placeholder="Saisir mot de passe"
          required
      ></b-form-input>
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
</b-container>
</template>

<script>
export default {
  name: "LoginView",
  data(){
    return{
      form: {
        email: null,
        password: null
      }
    }
  }
}
</script>

<style scoped>

</style>
