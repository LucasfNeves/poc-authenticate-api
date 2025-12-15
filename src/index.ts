import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sequelize from './infrastructure/database/config/database'
import { Logger } from './shared/utils/Logger'
import { router } from './routes/routes'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logger = new Logger('Server')
const app = express()

app.use(express.json())
app.use(cors())

app.use((_req, _res, next) => {
  next()
})

app.get('/', (_req, res) => res.status(200).json({ status: 'API is healthy' }))

const swaggerPath = path.resolve(__dirname, '../docs/swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api', router)
logger.info('Rotas registradas em /api')

const port = Number(process.env.PORT) || 3000

async function bootstrap() {
  try {
    await sequelize.authenticate()
    logger.info('Conexão com banco de dados estabelecida')

    await sequelize.sync({ alter: true })
    logger.info('Models sincronizados')

    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(port, () => {
        logger.info(`Servidor rodando na porta ${port}`)
      })
    }
  } catch (error) {
    logger.error('Falha ao iniciar aplicação', error)
    if (error instanceof Error) {
      logger.error(`Detalhes: ${error.message}`)
      console.error(error.stack)
    }

    if (!process.env.VERCEL) {
      process.exit(1)
    }
  }
}

bootstrap()

export default app
