<template>
  <div class="ma-3 pa-3 black--text scopecss">
      <v-row>
          <v-col>
              <h4 class="text-center">S. K. Somaiya College Of Arts, Science &amp; Commerce</h4>
              <h1 class="text-center">{{myclass.text}} Class Report</h1>
          </v-col>
      </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense fixed-header>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="scopecss text-left">Roll</th>
                <th class="scopecss text-left">Name</th>
                <th class="scopecss text-left">Total</th>
                <th class="scopecss text-left">Attended</th>
                <th class="scopecss text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in printData" :key="item.roll">
                <td class="scopecss">{{ item.roll }}</td>
                <td class="scopecss">{{ item.name }}</td>
                <td class="scopecss">{{ item.total }}</td>
                <td class="scopecss">{{ item.attended }}</td>
                <td class="scopecss">{{ item.percentage }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["printData","myclass"],
  data() {
    return {
    };
  },
  mounted() {
    cordova.plugins.printer.print()
 window.setTimeout(()=>{
     this.$router.push("/ClassReport")
 },2000);
  }
};
</script>

<style>
.scopecss{
    color:black !important;
    background: white!important;
}
</style>