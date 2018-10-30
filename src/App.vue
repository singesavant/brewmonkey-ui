<template>

  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">Brew Monkey</b-navbar-brand>
    </b-navbar>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
}

html, body {
  height: 100%;
}

.modal, .modal-title {
  color: black !important;
}



</style>
