<template>
  <v-container>
    <h1>{{this.$route.params.sessionid}}</h1>
    <v-containers fluid>
      <v-layout row wrap>
        <v-flex xs3 v-for="session in sessions" :key="session">
          <v-card @click="mark(session.roll)" class="xs4 ma-1 text-xs-center" :color="session.coll">
              <v-card-text>{{session.roll}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-containers>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
        coll:"yellow",
      sessions: [
        {roll:"01", coll:""},
        {roll:"02",coll:""},
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30
      ]
    };
  },
  methods:{
      mark(roll){
          var filter = this.sessions.find((item,i)=>{
              if(item.roll == roll){
                  if(this.sessions[i].coll == "red"){
                      this.sessions[i].coll = "green"
                  }
                  else if(this.sessions[i].coll == "green"){
                      this.sessions[i].coll = "red"
                  }
                  else{
                    this.sessions[i].coll = "red"
                  }
              }
          })
      }
  },
  mounted() {}
};
</script>

<style>
</style>