import Vuex from 'vuex';
import axios from 'axios';
import Cookie from 'js-cookie';

const createStore = () => {
  return new Vuex.Store({
    state:{
      loadedPosts: [],
      token: ''
    },
    getters:{
      loadedPosts(state){
        return state.loadedPosts
      },
      isAuthenticated(state){
        console.log("State Token : " + state.token);
        return state.token.length === 0
      }
    },
    mutations:{
      setPosts(state, posts){
        state.loadedPosts = posts
      },
      addPost(state, post){
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost){
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost
      },
      setToken(state, token){
        state.token = token;
      },
      clearToken(state){
        state.token = '';
      }
    },
    actions:{
      nuxtServerInit(vuexContext, context){
        return axios.get('https://nuxt-blog-99a13.firebaseio.com/posts.json').then(response => {
          const postsArray = [];
          for(const key in response.data){
            postsArray.push({...response.data[key], id: key});
          }
          vuexContext.commit('setPosts', postsArray);
        }).catch(e => context.error(e));
      },

      addPost(vuexContext, postData){
        const createdPost = {
          ...postData,
          updatedDate: new Date()
        };
        return axios.post('https://nuxt-blog-99a13.firebaseio.com/posts.json?auth=' + vuexContext.state.token, createdPost)
          .then(res => {
            vuexContext.commit('addPost', {...createdPost, id: res.data.name});
          })
          .catch(error => console.log(error))
      },

      editPost(vuexContext, postData){
        console.log("VuexToken : " + vuexContext.state.token);
        const createdPost = {
          ...postData,
          updatedDate: new Date()
        };
        return axios.put('https://nuxt-blog-99a13.firebaseio.com/posts/' + postData.id + '.json?auth=' + vuexContext.state.token, createdPost)
          .then(res => {
            vuexContext.commit('editPost', createdPost);
          })
          .catch(error => console.log(error))
      },

      setPosts(vuexContext, posts){
        vuexContext.commit('setPosts', posts)
      },

      initAuth(vuexContext, req){
        let token;
        let tokenExpiration;
        if(req){
          if(!req.headers.cookie){
            return "";
          }else{
            const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
            if(!jwtCookie){
              return "";
            }else{
              token = jwtCookie.split('=')[1];
              tokenExpiration = req.headers.cookie.split(';').find(c => c.trim().startsWith('tokenExpiration='))
                .split('=')[1];
            }
          }
        }else{
          token = localStorage.getItem("token");
          tokenExpiration = localStorage.getItem("tokenExpiration");
        }
        if(new Date().getTime() > +tokenExpiration || !token){
          vuexContext.dispatch("logout");
          return '';
        }
        vuexContext.commit("setToken", token);
      },

      authenticateUser(vuexContext, authData){
        let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.fbAPIKey;
        if(!authData.isLogin){
          authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + process.env.fbAPIKey;
        }
        return axios.post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).then(res => {
          let expirationTime = (new Date().getTime() + +(res.data.expiresIn) * 1000).toString();

          vuexContext.commit("setToken", res.data.idToken);

          localStorage.setItem("token", res.data.idToken);
          localStorage.setItem("tokenExpiration", expirationTime);

          Cookie.set('jwt', res.data.idToken);
          Cookie.set("tokenExpiration", expirationTime);

          return axios.post('http://localhost:3000/api/track-data', {data: "Authenticated!"})

        }).catch(e => console.log(e));
      },
      logout(vuexContext){
        vuexContext.commit('clearToken');
        Cookie.remove('jwt');
        Cookie.remove('tokenExpiration');
        if(process.client){
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }
      }
    }
  })
};

export default createStore;
