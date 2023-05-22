import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      nome: string
      avatarUrl: string
    } // user type is return type of `request.user` object
  }
}
