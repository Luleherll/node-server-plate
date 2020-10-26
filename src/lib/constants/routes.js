const SIGNUP = '/users/signup';
const LOGIN = '/users/login';
const NEW_ADMIN = '/users/add';
const UPDATE_USER = '/users/:userId/update';
const DELETE_USER = '/users/:userId/delete';
const GET_ALL_USERS = '/users/all';
const AUTHENTICATE = '/users/refresh';
const REVOKE_TOKEN = '/users/:userId/revoke';
const PASSWORD_RESET = '/users/:userId/reset-password';
const FORGOT_PASSWORD = '/users/forgot-password';

const NEW_API = '/apps/create';
const UPDATE_API = '/apps/:appId/update';
const DELETE_API = '/apps/:appId/delete';
const GET_USER_APPS = '/apps/user';
const GET_ALL_APPS = '/apps/all';

const CLIENT_ROUTES = '/um/:appName/:endpoint';

export { SIGNUP, NEW_ADMIN, UPDATE_USER, DELETE_USER, GET_ALL_USERS,LOGIN, AUTHENTICATE, REVOKE_TOKEN, PASSWORD_RESET, FORGOT_PASSWORD,
NEW_API, UPDATE_API, DELETE_API, GET_USER_APPS, GET_ALL_APPS, CLIENT_ROUTES
};