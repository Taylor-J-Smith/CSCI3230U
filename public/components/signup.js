module.exports = {
  template: '<b>{{notif}}</b><br><form>Name<br><input v-model="name" type="text" required autofocus><br>Email<br><input v-model="email" type="email" required><br>Password<br><input v-model="password" type="password" required><br><button v-on:click="signup($event)">Create Account</button></form>',
  replace: true,
  data: function () {
    return {
      page: 'signup',
      name: '',
      email: '',
      password: '',
      notif:'this signup form does not return any feedback'
    }
  },
  methods: {
    signup: function(event){
      event.preventDefault()
      var data = JSON.stringify({name: this.name, email: this.email, password: this.password})
      alert("posted:"+data);
      this.$http.post('/api/signup', data); //no feedback on this
    }
  }
}
