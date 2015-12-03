// token validation
function tokenValid() {
      alert("token validation")
      var jwt  = window.localStorage['LOCAL_TOKEN_KEY']
        if (jwt) {
          return true;
        } else {
          return false;
        }
}

// root router component
var App = Vue.extend({
  data: function(){
    return {
      auth: false,
      status: 'log in',
      usr: 'default',
      email: '',
      password: '', // TODO: storing plaintext password is a bad idea
    }
  },
  ready: function(){
    console.log(window.localStorage['LOCAL_TOKEN_KEY'])
    if(tokenValid()){
      alert("logged in")
      this.auth = true
      d3.select("#login").classed("hidden", true)
    } else {
      alert("not logged in")
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
          window.localStorage['LOCAL_TOKEN_KEY'] = data.token;
          window.location.href = "/"
        } else {
          console.log("incorrect login")
        }
      })
    },
    logout: function(){
      window.localStorage.removeItem('LOCAL_TOKEN_KEY')
      window.location.href = "/"
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