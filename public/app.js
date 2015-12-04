// token validation
function tokenValid() {
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
      loginmsg: '',
      usr: 'default',
      msW: '0',
      msL:  '0',
      tfe: '0',
      email: '',
      password: '', // TODO: storing plaintext password is a bad idea
    }
  },
  ready: function(){
    console.log(window.localStorage['LOCAL_TOKEN_KEY'])
    if(tokenValid()){
      this.auth = true
      d3.select("#login").classed("hidden", true)
      d3.select("#controls").classed("hidden", false)
      this.status = 'account'
      console.log(window.localStorage['LOCAL_ID'])
      Vue.http.headers.common['x-access-token'] = window.localStorage['LOCAL_TOKEN_KEY'];
      this.$http.post('/api/user', function (data, status, request) {

          // load data into view bindings
          this.usr = data.message.local.name
          this.email = data.message.local.email
          this.msW = data.message.local.msW
          this.msL = data.message.local.msL
          this.tfe = data.message.local.score
          console.log(data)
      }).error(function (data, status, request) {
          // handle error
          console.log("error")
      })
    } else {
      this.status = 'log in'
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
      var pwd = document.getElementById('pwd').value
      var data = JSON.stringify({email: this.email, password: pwd})
      this.$http.post('/api/login', data, function (data, status, request){
        if(data.success){
          console.log("log in")
          window.localStorage['LOCAL_TOKEN_KEY'] = data.token;
          window.localStorage['LOCAL_ID'] = data.id;
          window.location.href = "/"
        } else {
          console.log("incorrect login")
          this.loginmsg = 'incorrent login'
        }
      })
    },
    logout: function(){
      window.localStorage.removeItem('LOCAL_TOKEN_KEY')
      window.localStorage.removeItem('LOCAL_ID')
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
    '/2048': {
        component: require('./components/2048.js')
    },
    '*': {
        component: require('./components/404.js')
    }
})

//start the app
router.start(App, '#app');