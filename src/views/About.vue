<template>
  <v-card>
    <v-container
        class="overflow-y-auto"
        style="max-height: 500px"
        id="scroll-target"
    >
        <v-layout wrap row>
            <v-flex>
                <v-list>
                    <v-list-item
                        v-for="item in files"
                        :key="item.id"
                        style="border-bottom:1px grey dashed"
                    >
                        <v-list-item-title>
                            <v-icon >mdi-paperclip</v-icon>{{item.file.orgName}}
                            <v-icon style="color:red;" @click="delFile(item)">mdi-close</v-icon>
                        </v-list-item-title>
                        <v-btn @click="a(item)">test</v-btn>
                    </v-list-item>
                </v-list>
                
            </v-flex>
        </v-layout>
    </v-container>
</v-card>
</template>
<script>
import axios from 'axios'

export default {
    mounted()  {
        
    },
    data () {
        return {
            files:[
              {id:1,orgName:'asdf'},
              {id:2,orgName:'qwer'},
            ],
        }
    },
    methods:{
      delFile(item){
        console.log(this.files)
        this.files.splice(1,1)
      }
    }
}
</script>