<template>
  <v-container
    class="login fill-height"
    fluid
  >
    <v-row>
      <v-col
        cols="12"
        class="logo"
      >
        <v-img
          src="../assets/Logos/hr-black@2x.png"
          height="222"
          width="222"
        />
      </v-col>
      <v-col
        cols="12"
        class="form"
      >
        <v-card
          max-width="463"
          min-height="550"
        >
          <v-card-title class="text-h6">
            Login
          </v-card-title>
          <v-card-subtitle
            class="subtitle"
          >
            Welcome back, please login to your account
          </v-card-subtitle>
          <v-card-actions>
            <v-row>
              <v-col>
                <v-form @submit.prevent="loginSubmit()">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <p>Email Address</p>
                        <v-text-field
                          v-model="userLogin.email"
                          :rules="[rules.required]"
                          :placeholder="$t('login.userName')"
                          type="email"
                          filled
                          dense
                          append-icon="mdi-email-outline"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-row class="pass-form">
                          <v-col>
                            <p>Password</p>
                          </v-col>
                          <v-col>
                            <span><a href="#">Forget Password ?</a></span>
                          </v-col>
                        </v-row>
                        <v-text-field
                          v-model="userLogin.password"
                          :type="show1 ? 'text' : 'password'"
                          :append-icon="
                            show1 ? 'mdi-lock-outline' : 'mdi-lock-outline'
                          "
                          :rules="[rules.required, rules.min]"
                          :placeholder="$t('login.password')"
                          hint="At least 8 characters"
                          filled
                          minlength="8"
                          dense
                          @click:append="show1 = !show1"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
              <v-col>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mr-4 submit"
                      v-bind="attrs"
                      :class="{ 'is-loading': isLoading }"
                      :disabled="formValid"
                      v-on="on"
                      @click="loginSubmit"
                    >
                      {{ $t("login.login") }}
                    </v-btn>
                  </template>
                  <span>{{ $t("login.login") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-card-actions />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import { required, email, password } from 'vuelidate/lib/validators'
  export default {
    validations: {
      email: { required, email },
      password: { required, password },
    },
    data () {
      return {
        userLogin: {
          email: '',
          password: '',
        },
        rules: {
          required: (value) => !!value || 'Required.',
          min: (v) => v.length >= 8 || 'Min 8 characters',
        },
        show1: false,
        formValid: false,
        isValid: true,
      }
    },
    computed: {
      ...mapState({
        isLoading: (state) => state.login.isLoading,
        loginErrorMessage: (state) => state.login.loginErrorMessage,
        loginSuccessful: (state) => state.login.loggingIn,
      }),
    },
    watch: {
      userLogin: {
        handler (val) {
          if (this.userLogin.email && this.userLogin.password) {
            this.formValid = false
          } else {
            this.formValid = true
          }
        },
        deep: true,
      },
    },
    methods: {
      gotohomepage () {
        window.location.href = '/'
      },
      ...mapActions(['doLogin']),
      loginSubmit () {
        // console.log( this.doLogin({
        //     email: this.userLogin.email,
        //     password: this.userLogin.password,
        //   }));
        if (!this.formValid) {
          this.doLogin({
            email: this.userLogin.email,
            password: this.userLogin.password,
          })
        }
      },
    },
  }
</script>
<style lang="scss">
.container {
  padding: 0 !important;
  margin: 0 !important;
  .padding-0 {
    padding: 0 !important;
  }
  .padding-30 {
    padding: 30px;
  }
}
.logo {
  .v-image {
    margin: auto;
  }
}
.login {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.form {
  justify-content: center;
  align-content: center;
  .v-card {
    opacity: 1;
    margin: auto;
    border: solid #707070 0.25px;
    border-radius: 5px;
    padding: 15px;

    text-align: center;
    box-shadow: 0px 3px 6px #00000029;
    .v-card__actions {
      padding: 24px;
      text-align: -webkit-center;
    }
  }

  .v-input {
    width: 365px;
    border: transparent !important;
    .v-input__slot {
      padding: 0 9px;
      border: 0.25px solid #707070 !important;
      border-radius: 5px;
    }
  }
  .title {
    padding-top: 25px;
    justify-content: center;
    color: #000;
    font-size: 25px;
    text-align: center;
  }
  .subtitle {
    color: #000 !important;
    padding-top: 25px !important;
    text-align: center;
    line-height: 25px;
    font-size: 20px;
    padding: 0;
  }
  .v-form {
    padding-top: 25px;
    p {
      text-align: left;
      font-size: 15px;
      color: #000 !important;
      padding: 0 9px;
    }
  }
  .v-btn {
    margin-top: 17px !important;
    color: #fff !important;
    text-transform: none;
    font-size: 20px;
    border-radius: 5px;
    width: 365px;
    margin-right: 0 !important;
    height: 45px !important;
    background: linear-gradient(
      270deg,
      rgba(252, 97, 116, 1) 0%,
      rgba(255, 154, 68, 1) 100%
    );
    span {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }

  .pass-form {
    padding-top: 10px;
    p {
      text-align: left;
      font-size: 15px;
      color: #000 !important;
    }
    span a {
      float: right;
      text-decoration: none;
      font-size: 14px;
      padding: 0 9px;
      color: #707070 !important;
    }
  }
}

// .image{
//   width: 100%;
//   height: 100vh;
//   background-color: #fff;
//   img{
//       height: -webkit-fill-available;
//   }
// }
//   .v-card{
//
//     height: -webkit-fill-available;
//     background-color: #F5F5F5 !important;
//     left: 15%;
//     transform: translate(-51%, 0%);
//     .submit{
//       left: 50%;
//       transform: translate(-50%, 0%);
//       background-color: #E9BB70 !important;
//       color: #fff;
//     }
//     .header{
//     width: 100%;
//     text-align: center;
//     }
//     .d-flex{
//       justify-content: space-between;
//       display: flex;
//     }
//     .v-form{
//       padding: 20px;
//       input{
//         min-height: 40px !important;
//       }
//       .vue-tel-input{
//         margin: 15px 0;
//         &:focus-within{
//             box-shadow: unset !important;
//             border-color: unset !important;
//         }
//       }
//       v-text-field{
//   -      border-radius: 3px;
//         border: 1px solid #bbb;
//         text-align: left;
//       }
//       // .v-input{
//       //   &:focus{
//       //       box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
//       //       border-color: #66afe9;
//       //   }
//       // }
//       .v-text-field--outlined.v-input--has-state fieldset{
//         border: 1px solid #bbb;
//         &:focus{
//           outline: none;
//         }
//       }
//       .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details{
//         &:focus{
//           border: 1px solid #bbb;
//               outline: none;
//             box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
//             border-color: #66afe9;
//         }
//     }
//       .v-label{
//           left: 0px !important;
//           right: auto !important;
//         }
//     }
//     input:-internal-autofill-selected {
//       background-color: #fff !important;
//     }
//     .v-list-item{
//       background-color: #00000008;
//       padding:10px 20px;
//     }
//     .v-avatar{
//       margin: 0 15px;
//     }
//   }
//
</style>
