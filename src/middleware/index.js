import { Response } from '../utils';
import * as env from '../config';
import { validationMap } from '../lib/validation';

// const dbConnection = async(req, res, next) => {
//   const error = await errorHandlers.checkDbConnection(connection);
//   if (error) {
//     return next(error)
//   }
//   next()
// }

const checkEnvVariables = (req, res, next) => {
  const missing = [];
  for (const variable in env) {
    if (env.hasOwnProperty(variable) && !env[variable]) {
      missing.push(variable);
    }
  }
  
  if (missing.length) {
    return next({ message: 'Missing environmental variables', list: missing });
  } else { next(); }
  
};

// eslint-disable-next-line no-unused-vars
const handleErrors = (err, req, res, next) => {
  console.log(err);
  if (err.error) {
    return Response.failure(res, err.error, err.status);
  } else {
    env.Logger.error(err);
  }
  return Response.failure(res);
};

const dataValidator = (req, res, next) => {
  const {
    body: data,
    route: { path }
  } = req;
  let message;
  const { error } = validationMap.get(path).validate(data);

  if (error) {
    const {
      details: [first]
    } = error;
    message = first.message.replace('"', '').replace('"', '');
  }
  return (message && next({ error: message, status: 400 })) || next();
};

const connectToDBs = async(req, _, next) => {

  
  return next();
};

export { dataValidator, handleErrors, checkEnvVariables, connectToDBs };
export { default as Auth } from './auth';
