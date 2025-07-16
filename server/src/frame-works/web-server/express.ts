import express, { json, urlencoded, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '~/build/routes';

const isProduction = process.env.NODE_ENV === 'production';

export const app = express();

app.use(express.static('public'));

app.use(
  urlencoded({
    extended: true,
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
