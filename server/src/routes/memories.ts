import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  // Cria uma memória
  app.post('/memories', async (req) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: 'b1568bea-5b0b-46e5-aaf7-d996ae7559ba',
      },
    })
    return memory
  })

  // Lista todas as memórias
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  // busca por uma memória específica
  app.get('/memories/:id', async (req) => {
    // const { id } = req.params => não funciona pois ID é do tipo "unkown"
    // fastify nao consegue validar se o ID é um numero ou string,
    // por isso a biblioteca "Zod" fará esta validação
    // npm i zod

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    // Agora a desestruturação do objeto "req.params" passa por uma validação
    // dentro do paramsSchema e caso a assinatura seja conforme o Schema, retornará
    // o uuid para a variável
    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.put('/memories/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
        userId: 'b1568bea-5b0b-46e5-aaf7-d996ae7559ba',
      },
    })
    return memory
  })

  app.delete('/memories/:id', async (req) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
