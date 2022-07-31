import { SIGIN, SIGNUP } from '@/graphql/mutations/auth/signup.js'

export default {
  methods: {
    async signIn({ email, password }) {
      const { errors } = await this.$apollo.mutate({
        mutation: SIGIN,
        variables: { email, password },
        errorPolicy: 'all',
      })

      if (errors && errors.length > 0) {
        throw errors[0]
      }
    },
    async signUp(data) {
      const { errors } = await this.$apollo.mutate({
        mutation: SIGNUP,
        variables: data,
        errorPolicy: 'all',
      })

      if (errors && errors.length > 0) {
        throw errors[0]
      }
    }
  },
}
