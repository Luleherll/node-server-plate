import { ROUTES } from '../lib/constants';
import { User } from '../controllers';
import { Auth, dataValidator } from '../middleware';

const { authenticate, isAdmin, withPermissions } = Auth;
export default (router) => {
  router.route(ROUTES.SIGNUP).post(dataValidator, User.signup);
  router.route(ROUTES.NEW_ADMIN).post(authenticate, isAdmin, withPermissions(['Add admin']), dataValidator, User.addAdmin);
  router.route(ROUTES.UPDATE_USER).put(authenticate,isAdmin, withPermissions(['Access clients','Change permission']), dataValidator, User.update);
  router.route(ROUTES.DELETE_USER).delete(authenticate, isAdmin, withPermissions(['Access clients']), User.delete);
  router.route(ROUTES.GET_ALL_USERS).get(authenticate, isAdmin, User.getAll);
  router.route(ROUTES.LOGIN).post(dataValidator, User.login);
  router.route(ROUTES.AUTHENTICATE).get(User.authenticate);
  router.route(ROUTES.REVOKE_TOKEN).put(authenticate, isAdmin,withPermissions([]), User.revokeToken);
  router.route(ROUTES.PASSWORD_RESET).put(dataValidator, User.updatePassword);
  router.route(ROUTES.FORGOT_PASSWORD).post(dataValidator, User.forgotPassword);

  return router;
};