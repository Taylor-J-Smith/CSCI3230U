// root router component
var App = Vue.extend({
  data: function () {
    return {
      message: ''
    }
  },
  methods: {
    togglefooter: function(event){
      var page = d3.select("#main")
      page.classed("slide", !page.classed("slide"));
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
    '/singleplayer': {
        component: require('./components/singleplayer.js')
    },
    '*': {
        component: require('./components/404.js')
    }
})

//start the app
router.start(App, '#app');