module.exports = {
  template: '<h1>{{msg}}</h1><p>this webapp was developed by Dennis Pacewicz and Taylor Smith</p><a href="https://github.com/Taylor-J-Smith/CSCI3230U" class="github">github page</a>',
  replace: true,
  data: function () {
    return {
      msg: 'about'
    }
  }
}