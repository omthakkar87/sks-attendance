<template>
    <div class="student-home">
        <v-container>
            <v-layout row wrap>
                <v-flex xs12 sm6 pa-2>
                    <v-card color="primary">
                        <v-layout>
                            <v-flex xs12 class="text-center">
                                <v-card-title primary-title>
                                    <div style="width:100%;">
                                        <div class="headline">Take Attendance</div>
                                        <div class="caption">Start a Attendance Session By Pressing The Create Session Button Below</div>
                                    </div>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-card-actions class="pa-2">
                            <v-spacer></v-spacer>
                            <v-btn text @click="take">Create Session</v-btn>
                        </v-card-actions>
                        
                    </v-card>
                    
                </v-flex>
                <v-flex xs12 sm6 pa-2>
                    <v-card color="primary darken-3">
                        <v-layout>
                            <v-flex xs12 class="text-center">
                                <v-card-title primary-title>
                                    <div style="width:100%;">
                                        <div class="headline">View Report</div>
                                        <div class="caption">Generate Class Attendance Report</div>
                                    </div>
                                </v-card-title>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-card-actions class="pa-2">
                            <v-spacer></v-spacer>
                            <v-btn text @click="classreport">Generate Report</v-btn>
                        </v-card-actions>
                        
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import firebase from "firebase";
    export default {
        methods:{
            take(){
                this.$router.push('/Take')
            },
            classreport(){
                this.$router.push('/ClassReport')
            }
        }
    }
</script>

<style>

</style>