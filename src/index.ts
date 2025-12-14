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

// Middlewares
app.use(express.json())
app.use(cors())

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Swagger
const swaggerPath = path.resolve(__dirname, '../docs/swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Rotas - ANTES do bootstrap
app.use('/api', router)
logger.info('Rotas registradas em /api')

const port = Number(process.env.PORT) || 3000

async function bootstrap() {
  try {
    await sequelize.authenticate()
    logger.info('Conexão com banco de dados estabelecida')

    await sequelize.sync({ alter: false })
    logger.info('Models sincronizados')

    app.listen(port, () => {
      logger.info(`Servidor rodando na porta ${port}`)
      logger.info(
        `Documentação disponível em http://localhost:${port}/api-docs`
      )
      logger.info('Rotas disponíveis:')
      logger.info('  GET  /api/health')
      logger.info('  POST /api/auth/register')
    })
  } catch (error) {
    logger.error('Falha ao iniciar aplicação', error)
    if (error instanceof Error) {
      logger.error(`Detalhes: ${error.message}`)
      console.error(error.stack)
    }
    process.exit(1)
  }
}

bootstrap()
