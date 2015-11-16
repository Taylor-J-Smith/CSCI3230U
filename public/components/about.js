module.exports = {
  template: '<h1>{{msg}}</h1>this is the {{msg}} page.',
  replace: true,
  data: function () {
    return {
      msg: 'about'
    }
  }
}