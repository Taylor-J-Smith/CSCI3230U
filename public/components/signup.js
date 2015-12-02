module.exports = {
  template: '<h1>{{page}}</h1>this is the {{page}} page.',
  replace: true,
  data: function () {
    return {
      page: 'signup'
    }
  },
  ready: function(){
  	console.log("testing!");
  }
}
