<template>
  <v-container class="text-center" pa-5>
    <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
  </v-container>
</template>

<script>
export default {
  props: ["role"],
  data() {
    return {};
  },
  mounted() {
    if (this.role == "student") {
      this.$router.push("/StudentHome");
    } else if (this.role == "faculty") {
      this.$router.push("/FacultyHome");
    } else if (this.role == "admin") {
      this.$router.push("/AdminHome");
    } else if (this.role == "") {
      this.$router.push("/login");
    } else if (this.role == undefined) {
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>