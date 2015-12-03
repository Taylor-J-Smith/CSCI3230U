module.exports = {
  template: '<h1>{{page}}</h1><p>this is the {{page}} page.</p>',
  replace: true,
  data: function () {
    return {
      page: 'dashboard',
    }
  }
}
