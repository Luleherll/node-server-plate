import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { handleErrors, checkEnvVariables } from './middleware';
import routes from './routes';
import { PORT, Logger, logEnv, MONGO } from './config';

const app = express();

mongoose.connect(MONGO.url, MONGO.options);
mongoose.connection.on('connected', ()=> Logger.info('Database connected.'));

/* Connects to all client databases */

// middleware
app.use(helmet());
app.use(
  morgan('combined', {
    stream: { write: log => Logger[logEnv](log) }
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(checkEnvVariables);

// routes
app.use('/api/v1', routes);
app.use(handleErrors);
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default server;