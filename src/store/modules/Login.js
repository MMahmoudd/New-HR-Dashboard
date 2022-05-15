import { API_URL } from '../../config/config'
import router from '../../router/router'
import axios from 'axios'

const Login = {
  state: {
    // isLoading: false,
    loginErrorMessage: null,
    loginSuccessful: false,
    token: localStorage.getItem('token'),
    userDataPermission: null,
    userAuth: '',
    userToken: '',
    userData: JSON.parse(localStorage.getItem('userData')),
    successMessage: '',
    successMessageReset: '',

  },
  getters: {
    token (state) {
        return state.token
    },
  },
  mutations: {
    resetState (state) {
      state.isLoading = false
      state.loginErrorMessage = null
      state.loginSuccessful = false
      state.successMessage = ''
      state.successMessageReset = ''
  },
    // Logout
    logout () {
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      router.push('/Login')
    },
    //  Set Token
    setToken (state, data) {
      localStorage.setItem('token', data.token)
      state.token = data.token
  },
  },
  actions: {
    doLogin ({ commit, state, dispatch }, loginData) {
      commit('resetState')
      console.log(loginData)
      const userData = {
        email: loginData.email.replace(/\s+/g, ''),
        password: loginData.password,
        }
      axios.post(`${API_URL}/login`, userData)
        .then((response) => {
          state.isLoading = true
          // console.log( response)
          if (response.data.status === 200) {
            localStorage.setItem('token', response.data.response.data.token)
            localStorage.setItem('userDataPermission', response.data.response.data.roles[0])
            state.userToken = response.data.response.data.token
            state.userDataPermission = response.data.response.data.roles[0]
            dispatch('checkUs6erData')
            window.location.href = process.env.BASE_URL
          } else {
            // state.loginErrorMessage = response.data.error[0]
            state.isLoading = true
          }
        })
        .catch(error => {
          console.log(error)
          state.loginErrorMessage = error.response.data.error[0]
          state.isLoading = true
        })
    },
  },
}

export default Login
