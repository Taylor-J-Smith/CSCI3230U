module.exports = {
  template: '<form v-on:submit="signup">Name<br><input v-model="name" type="text" required autofocus>Email<br><input v-model="email" type="email" required><br>Password<br><input v-model="password" type="password" required><br><button type="submit">Create Account</button></form>',
  replace: true,
  data: function () {
    return {
      page: 'signup',
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    signup: function(){
      var data = JSON.stringify({name: this.name, email: this.email, password: this.password})
      alert("posted:"+data);
      this.$http.post('/api/signup', data);
    }
  },
  ready: function(){
  	console.log("testing!");
  }
}
