module.exports = {
  template: '<h1>{{page}}</h1>this is the {{page}} page. <div id="game"><div></div></div>',
  replace: true,
  data: function () {
    return {
      page: 'singleplayer'
    }
  },
  ready: function(){
    d3.select('#game div').text('game goes here!');
  }
}
