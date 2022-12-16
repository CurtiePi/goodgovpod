<template>
  <div class="container">
    <div class="col-md-12 mt-5">
      <h1>{{ greeting }}</h1>
      <p>
         <router-link :to="{ name: 'ContactList' }">
           <button>Enter</button>
         </router-link>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'homeComponent',
  data () {
    return {
      greeting: 'Welcome',
      msg: 'Good Government Podcast Contacts',
    }
  },
  methods: {
    createGreeting (name) {
      var date = new Date()
      var hour = date.getHours()
      var timeGreeting = ''
      if (hour >= 0 && hour < 12) {
        timeGreeting ='Good Morning' 
      } else if (hour >= 12 && hour < 18) {
        timeGreeting ='Good Afternoon' 
      } else {
        timeGreeting ='Good Evening' 
      }

      this.greeting = `${timeGreeting} ${name}`
    },
  },
  mounted () {
    this.createGreeting("Friend")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    background-color: rgba(0, 176, 234, 0.5);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-container {
    text-align: center;
    height: 40px;
    position: relative;
    top: -91%;
    left: -35%;
  }
</style>
