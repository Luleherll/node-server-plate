import { ROUTES } from '../constants';
import { forgotPassword, login, passwordReset, signUp, updateUser } from './auth';

const validationMap = new Map([
  [ROUTES.SIGNUP, signUp], [ROUTES.UPDATE_USER, updateUser], [ROUTES.LOGIN, login], [ROUTES.PASSWORD_RESET, passwordReset],
  [ROUTES.FORGOT_PASSWORD, forgotPassword]
]);

export { validationMap };