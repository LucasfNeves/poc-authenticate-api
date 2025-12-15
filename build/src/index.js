var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './infrastructure/database/config/database';
import { Logger } from './shared/utils/Logger';
import { router } from './routes/routes';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = new Logger('Server');
const app = express();
app.use(express.json());
app.use(cors());
app.use((req, _res, next) => {
    next();
});
app.get('/', (req, res) => res.status(200).json({ status: 'API is healthy' }));
const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', router);
logger.info('Rotas registradas em /api');
const port = Number(process.env.PORT) || 3000;
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            logger.info('Conexão com banco de dados estabelecida');
            yield sequelize.sync({ alter: true });
            logger.info('Models sincronizados');
            app.listen(port, () => {
                logger.info(`Servidor rodando na porta ${port}`);
            });
        }
        catch (error) {
            logger.error('Falha ao iniciar aplicação', error);
            if (error instanceof Error) {
                logger.error(`Detalhes: ${error.message}`);
                console.error(error.stack);
            }
            process.exit(1);
        }
    });
}
bootstrap();
