<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand mr-auto" :to="{ name: 'Home' }" replace><img src="images/goodgovpod.png" height="40" width="41" alt="Good Government Podcast"/></router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb2 mb-lg-0">
          <li class="nav-item dropdown ms-3"
            v-for="(link, index) in navLinks"
            :key="index"
          >

                <router-link class="text-decoration-none" 
                    :to="{ name: link.name }"
                    :style="{color: '#FFF'}"
                    replace
                >
                  <i :class="link.icon" />
                    {{ link.text }}
                </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import headerLinks from '@/assets/HeaderLinks'

export default{
  props: ['background', 'linkColor', 'hoverBackground'],
  components: {
  },
  data () {
    return {
      navLinks: headerLinks 
    }
  },
  methods: {
    expandTab (event) {
      event.currentTarget.style.background = this.hoverBackground || '#999'
      event.currentTarget.lastChild.style.display = 'block'
    },
    compressTab (event) {
      event.currentTarget.style.background = this.background || '#333'
      event.currentTarget.lastChild.style.display = 'none'
    }
  }
}
</script>
<style scoped>
.dropdown-menu-dark {
    background-color: teal;
}
</style>
