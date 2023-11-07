/* eslint-disable camelcase */
import passport from 'passport';
import local from 'passport-local';
import usersModel from '../dao/models/users.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import config from './config.js';
import { Carts } from '../dao/factory.js';

const cartManager = new Carts();
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email', session: false },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false, {
              message: 'Faltan datos'
            });
          }
          const user = await usersModel.findOne({ email: username });
          if (user || email === config.adminName) {
            return done(null, false, {
              message: 'El usuario ya existe'
            });
          }
          const cart = await cartManager.addCart();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cart._id
          };
          const result = await usersModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(`Error al obtener el usuario: ${error}`);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email', session: false },
      async (username, password, done) => {
        try {
          if (
            username === config.adminName &&
            password === config.adminPassword
          ) {
            const user = {
              email: username
            };
            return done(null, user);
          } else if (
            username === config.adminName &&
            password !== config.adminPassword
          ) {
            return done(null, false, {
              message: 'Contraseña incorrecta'
            });
          } else {
            const user = await usersModel.findOne({
              email: username
            });
            if (!user) {
              return done(null, false, {
                message: 'El usuario no existe'
              });
            }
            if (!isValidPassword(user, password)) {
              return done(null, false, {
                message: 'Contraseña incorrecta'
              });
            }
            return done(null, user);
          }
        } catch (error) {
          return done(`Error al obtener el usuario: ${error}`);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: config.githubId,
        clientSecret: config.githubSecret,
        callbackURL: config.githubCallback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await usersModel.findOne({
            email: profile._json.email
          });
          if (!user) {
            const cart = await cartManager.addCart();
            const newUser = {
              first_name: profile._json.name,
              last_name: '',
              age: 18,
              email: profile._json.email,
              password: '',
              cart: cart._id
            };
            const result = await usersModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (error) {
          return done(`Error al obtener el usuario: ${error}`);
        }
      }
    )
  );
  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.passportSecret
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    'admin',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.passportSecret
      },
      async (jwt_payload, done) => {
        try {
          if (jwt_payload.user.role === 'admin') {
            return done(null, jwt_payload);
          }
          return done(null, false, { message: 'No autorizado' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    'user',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.passportSecret
      },
      async (jwt_payload, done) => {
        try {
          if (jwt_payload.user.role === 'user') {
            return done(null, jwt_payload);
          }
          return done(null, false, { message: 'No autorizado' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  if (user.email === config.adminName) {
    done(null, 'admin');
  } else {
    done(null, user._id);
  }
});

passport.deserializeUser(async (id, done) => {
  if (id === 'admin') {
    const adminUser = {
      email: config.adminName
    };
    return done(null, adminUser);
  } else {
    try {
      const user = await usersModel.findById(id);
      return done(null, user);
    } catch (error) {
      return done(`Error al obtener el usuario: ${error}`);
    }
  }
});

const cookieExtractor = (req, res) => {
  let token = null;
  if (req && req.cookies) token = req.cookies.coderCookie;
  return token;
};

export default initializePassport;
