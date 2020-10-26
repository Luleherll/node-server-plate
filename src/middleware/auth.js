import { JWT_SECRET } from '../config';
import { JWTUtil } from '../utils';

export default class Auth {
    static authenticate = (req, res, next) => {
        try {
            let token = req.headers.authorization;
            if (!token) next({error: 'Please provide an authorization token.', status: 401});
            token = token.split(' ')[1];
            const {error, value } = new JWTUtil('', JWT_SECRET, 200000).decodeToken(token);
            if (error === 'jwt expired') next({error: 'Please login again.', status: 403});
            if (error) next({});
            req.user = value;
            next();
        } catch (error) {
            next(error);
        }
    }

    static isOwner = ({user: {_id }, params: {userId}}) => _id === userId;

    static isAdmin = (req,res,next) => {
        if (Auth.isOwner(req)) return next();
        return req.user.isAdmin ? next() : next({error: 'For administrators only.', status: 401 });
    } 

    // static withPermissions = (list) => async(req,res,next) => {
    //     if (Auth.isOwner(req)) return next();
    //     const {permissions} = req.user;
    //     const perms = await Permission.find({$and: permissions.map(p => ({_id: p}))});
    //     const filter = perms.filter(p => [...list, 'Super admin'].includes(p.name));
    //     console.log(filter);
    //     return filter.length ? next() : next({error: 'You need permission to access resource', status: 401});
    // }
}