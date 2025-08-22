import express, { json, urlencoded, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '~/build/routes';
import instanceMongodb from '../database/connection';
import { AgentController } from '~/controllers/agent.controller';

const isProduction = process.env.NODE_ENV === 'production';
instanceMongodb.connect();

export const app = express();

app.use(express.static('public'));

app.use(
  urlencoded({
    extended: true,
    limit: '10mb',
  }),
);

app.disable('x-powered-by');
app.use(json({ limit: '10mb' }));
app.use(morgan('tiny'));
app.use(cors());

if (isProduction) {
  app.use('/api/:version/generative/*');
} else {
  app.use('/api/v1/data/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
    res.send(swaggerUi.generateHTML(await import('../../build/swagger.json')));
  });
}

RegisterRoutes(app);

// Add streaming agent route (not handled by TSOA)
const agentController = new AgentController();
app.post('/api/v1/data/agent/stream', (req: Request, res: Response) => {
  agentController.generateWithAgentStreaming(req, res);
});
