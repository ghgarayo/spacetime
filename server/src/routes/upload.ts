import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'fs'
import { extname, resolve } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (req, res) => {
    const uploadedFile = await req.file({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5mb
      },
    })

    if (!uploadedFile) {
      return res.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(uploadedFile.mimetype)

    if (!isValidFileFormat) {
      return res.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(uploadedFile.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../upload', fileName),
    )

    await pump(uploadedFile.file, writeStream)

    const fullUrl = req.protocol.concat('://').concat(req.hostname)
    const fileUrl = new URL(`/upload/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
