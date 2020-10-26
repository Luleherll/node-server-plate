import User from '../models/User';
import { JWTUtil, Mailer, Response } from '../utils';
import { JWT_ISSUER, JWT_SECRET, FRONTED_URL } from '../config';
import { EMAIL_TYPES } from '../lib/constants';

const JWT = new JWTUtil(JWT_ISSUER, JWT_SECRET, (new Date().getTime() + 86400 * 1000)/1000);

export const generateTokens = async(user) => {
    const accessToken = JWT.getExpiringToken(user.filtered());
    const refreshToken = JWT.getRefreshToken({_id: user._id});
    return {accessToken, refreshToken};
};

export default class UserController {

    static signup = async(req,res,next) => {
        try {
            let {body: newUser } = req;
            if (await User.findOne({$or: [{email: newUser.email}, {username: newUser.username}]}))
                throw {error: 'User with email / username already exists.', status: 400 };
            newUser = new User(newUser);
            await newUser.save();

            const email = Mailer.generateEmail(newUser, EMAIL_TYPES.VERIFICATION, {actionLink: `${FRONTED_URL}/?verify_acc=${newUser._id}`});
            Mailer.send(email);

            return Response.success(res, 'Signup successful.', newUser.filtered(), 201);
        } catch (error) {
            next(error);
        }
    };

    static login = async(req,res,next) => {
        try {
            const {email, password} = req.body;
            const exists = await User.findOne({email});
            if (!exists) return next({error: 'User does not exist.', status: 404 });
            if(exists.signupVia === 'email' && !exists.validatePassword(password)) return next({error: 'Invalid email or password.', status: 401 });

            const tokens = await generateTokens(exists);
            exists.refreshToken = tokens.refreshToken;
            await exists.save();
            return Response.success(res, 'Successful', tokens, 200);

        } catch (error) {
            next(error);
        }
    }

    static authenticate = async(req,res,next) => {
        try {
            let token = req.headers.authorization;
            token = token.split(' ')[1];
            const { value: {_id}} = JWT.decodeToken(token);
            const user = await User.findById(_id);
            if (user.refreshToken !== token) return next({error: 'Please login again.', status: 401});
            const tokens = await generateTokens(user);
            return Response.success(res, 'Successful', tokens, 200);
        } catch (error) {
            next(error);
        }
    }

    static revokeToken = async(req,res,next) => {
        try {
            const updated = await User.updateOne({_id: req.params.userId}, {refreshToken: 'revoked'});
            return updated.nModified > 0 ? Response.success(res, 'Token revoked successfully.', req.params.userId, 200)
                    : Response.failure(res, updated.n ? 'Not updated.' : 'User was not found.', 404);
        } catch (error) {
            next(error);
        }
    }

    static update = async(req, res,next) => {
        try {
            let {body: update, params: {userId} } = req;
            const exists = await User.findById(userId);
            if (!exists) throw {error: 'User does not exist.', status: 404 };
            await exists.update(update);
            return Response.success(res, 'User updated successfully.', update, 200);
        } catch (error) {
            next(error);
        }
    }

    static delete = async(req, res, next) => {
        try {
            const { userId } = req.params;
            const deleted = await User.deleteOne({_id: userId});

            return deleted.deletedCount > 0 ? Response.success(res, 'User deleted successfully.', userId, 200)
                    : Response.failure(res, 'User was not found.', 404);
        } catch (error) {
            next(error);
        }
        
    }

    static getAll = async(req, res, next) => {
        try {
            const { query: { query, page = 1, limit = 200, admin: isAdmin } } = req;
		
		let keyword = query  ? { email: new RegExp(`${query}`, 'gi'), name: new RegExp(`${query}`, 'gi')} : {};
        if (isAdmin !== undefined) keyword.isAdmin = isAdmin;

		const data = await User.find(keyword)
							.skip((page - 1) * limit)
							.limit(+limit)
							.sort({_id: 1});
        const total = await User.find(keyword).count();
        return Response.success(res, 'Fetched', {total, data }, 200);
        } catch (error) {
            next(error);
        }
    }

    static forgotPassword = async(req,res,next) => {
        try {
            const {email} = req.body;
            const exists = await User.findOne({email});
            if (!exists) throw {error: 'User does not exist.', status: 404 };
            exists.passReset = true;
            await exists.save();

            const emailT = Mailer.generateEmail(exists, EMAIL_TYPES.PASSWORD_RESET, {actionLink: `${FRONTED_URL}/?pass_forgot=${exists._id}`});
            Mailer.send(emailT);
            return Response.success(res, 'An email with a reset link has been sent. Please check your inbox!', {}, 200);
        } catch (error) {
            next(error);
        }
    }

    static updatePassword = async(req,res,next) => {
        try {
            const { body: {newPassword}, params: {userId} } = req;
            const exists = await User.findById(userId);
            if (!exists) throw {error: 'User does not exist.', status: 404 };
            if (!exists.passReset) throw {error: 'Invalid reset link. Try again.', status: 400};
            exists.password = newPassword;
            exists.passReset = false;
            await exists.save();
            return Response.success(res, 'Your password has been updated.', {}, 200);
        } catch (error) {
            return next(error);
        }
    }
}