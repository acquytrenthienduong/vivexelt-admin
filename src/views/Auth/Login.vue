<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9"></div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <div class="text-muted text-center mt-2 mb-3">
                  <b-img
                    src="https://www.myjob.mu/help/images/logoMU.png"
                    fluid
                    alt="Responsive image"
                    style="margin-bottom: 50px;"
                  ></b-img>
                </div>
              </div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Email"
                    :rules="{required: true, email: true}"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                    v-model="email"
                  ></base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{required: true, min: 3}"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  ></base-input>

                  <div class="text-center">
                    <base-button
                      type="primary"
                      :disabled="isLoading"
                      native-type="submit"
                      class="my-4"
                    >Sign in</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <b-col cols="6"></b-col>
            <b-col cols="6" class="text-right">
              <router-link to="/register" class="text-light">
                <small>Forgot password?</small>
              </router-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import AuthService from '@/core/services/auth'
export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    };
  },
  methods: {
    ...mapActions('auth', {
      signIn: 'signIn',
    }),
    async onSubmit() {
      if (this.email.trim() && this.password.trim()) {
        this.isLoading = true
        let result = await this.signIn({ username: this.email, password: this.password })
        if (result.success) {
          this.afterSignedIn()
        } else {
          this.$notify({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          type: 'danger',
          message: result.error_message || 'Something went wrong',
        })
        }

        this.isLoading = false
      }
    },
    async afterSignedIn() {
      this.$router.push({ name: 'dashboard' })
    }
  },
  mounted() {
    if (AuthService.isAuthenticated()) {
      this.$router.push({ name: 'dashboard' })
    }
  }
};
</script>
