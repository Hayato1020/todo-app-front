<template>
  <div id="app">
    <v-btn 
      type ="button" 
      v-if="$_accessToken()==''"
      @click="doLogin()"
    >
      ログイン
    </v-btn>
    <v-btn 
      type ="button"
      v-else 
      @click="doLogout()"
      >
        ログアウト
      </v-btn>
    <nav>
    </nav>
    <router-view/>

  </div>
</template>
<script>
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import router from "./router";

export default{
methods:{
  doLogin:function(){
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //const credential = 
          GoogleAuthProvider.credentialFromResult(result);
        //const accessToken = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        //ローカルストレージにデータを保存
        this.$_setAccessToken(user.accessToken)
        
        //console.log(credential)
        //console.log(accessToken)
        console.log(user)
        // ...
        router.push("/tasks")
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode)
        console.log(errorMessage)
        console.log(email)
        console.log(credential)
      });
    },
    doLogout:function(){
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        this.$_setAccessToken('')
        router.push("/")
      }).catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorCode)
        console.log(errorMessage)
        console.log(email)
        console.log(credential)
      });
    }
  }
}

</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
