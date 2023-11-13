import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import path from 'path';
import __dirname, { generateProduct } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import MessagesManager from './dao/mongoDb/MessageManager.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/sessions.js';
import passport from 'passport';
import initializePassport from './config/passport.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import errorHandler from './middlewares/errors/index.js';
import { addLogger, devLogger, prodLogger } from './services/log/logger.js';

const messagesManager = new MessagesManager();

const mongoURL = config.mongoUrl;
const PORT = config.port;
const logger = config.logger === 'DEV' ? devLogger : prodLogger;
const app = express();

app.use(addLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/public')));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'handlebars');
app.use(cookieParser(config.cookieSecret));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      ttl: 1800
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  })
);
initializePassport();
app.use(passport.initialize());

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  res.send({ status: 'success', payload: products });
});
app.get('/loggertest', (req, res) => {
  req.logger.fatal('Fatal desde el logger');
  req.logger.error('Error desde el logger');
  req.logger.warning('Warning desde el logger');
  req.logger.info('Info desde el logger');
  req.logger.http('Http desde el logger');
  req.logger.debug('Debug desde el logger');
  res.json('Mensaje de prueba desde el logger');
});
app.use('/', viewsRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Servidor ON http://localhost:${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  logger.debug('Cliente conectado');
  socket.on('disconnect', () => {
    logger.debug('Cliente desconectado');
  });

  socket.emit('server:updatedProducts');
  socket.on('client:updateProduct', () => {
    io.emit('server:updatedProducts');
  });

  socket.on('nuevousuario', async (usuario) => {
    socket.broadcast.emit('broadcast', usuario);
    socket.emit('chat', await messagesManager.getMessages());
  });
  socket.on('mensaje', async (info) => {
    await messagesManager.createMessage(info);
    io.emit('chat', await messagesManager.getMessages());
  });
});
