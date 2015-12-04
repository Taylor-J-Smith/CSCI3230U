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
      var pwd = document.getElementById('pwd').value
      var data = JSON.stringify({name: this.name, email: this.email, password: pwd})
      this.$http.post('/api/signup', data, function (data, status, request){
        if(data.success){
          console.log("account created")
          window.localStorage['LOCAL_TOKEN_KEY'] = data.token;
          window.localStorage['LOCAL_ID'] = data.id;
          window.location.href = "/"
        } else {
          console.log("signup failed")
        }
      })
    }
  }
}
