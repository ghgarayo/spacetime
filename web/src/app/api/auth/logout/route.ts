import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirectURL = new URL('/', req.url)

  return NextResponse.redirect(redirectURL, {
    headers: {
      // setar o max-age para 0 faz com que o cookie expire
      // e com isso o usuário seja deslogado do sistema
      'Set-Cookie': `token=; Path=/; max-age=0;`,
    },
  })
}
