module.exports = {
  template: '<h1>{{msg}}</h1><p>this webapp was developed by Dennis Pacewicz and Taylor Smith</p>',
  replace: true,
  data: function () {
    return {
      msg: 'about'
    }
  }
}