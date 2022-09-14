<template>
    <v-rating
        v-model="this.priorityOfTask"
        background-color=#F57C00
        color=#F57C00
        readonly
    ></v-rating>
</template>

<script>
  export default {
    props:{
        rating:null
        },
    data: function() {
      return {
        priorityOfTask:null
      }
    },
    mounted: function(){
      this.priorityOfTask = this.rating
    },
    
    methods: {
        
    },
    watch:{
      'rating':function(){
        this.priorityOfTask = this.rating
      }
    },
    
  }
</script>
