// root router component
var App = Vue.extend({
  data: function(){
    return {
      status: 'log in',
      usr: 'default',
      email: '',
      password: '', // TODO: storing plaintext password is a bad idea
    }
  },
  methods: {
    togglefooter: function(event){
      var page = d3.select("#main")
      var footer = d3.select("#footer")
      page.classed("slide", !page.classed("slide"))
      footer.classed("slide", page.classed("slide"))
    },
    collapse: function(){
      var page = d3.select("#main")
      var footer = d3.select("#footer")
      page.classed("slide", false)
      footer.classed("slide", false)

    },
    login: function(event){
      event.preventDefault()
      var data = JSON.stringify({email: this.email, password: this.password})
      this.$http.post('/api/login', data, function (data, status, request){
        if(data.success){
          console.log("log in")
          console.log(data.token)
        } else {
          console.log("incorrect login")
        }
      })
    }
  }
})

Vue.use(require('vue-resource'));
// create a router instance.
var router = new VueRouter({
  history: true,
  saveScrollPosition: true
});

// define some routes.
// each route maps to a component.
router.map({
    '/': {
        component: require('./components/dashboard.js')
    },
    '/about': {
        component: require('./components/about.js')
    },
    '/signup': {
        component: require('./components/signup.js')
    },
    '/minesweeper': {
        component: require('./components/minesweeper.js')
    },
    '*': {
        component: require('./components/404.js')
    }
})

//start the app
router.start(App, '#app');