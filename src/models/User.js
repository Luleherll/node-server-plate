import mongoose from 'mongoose';
import { Hash } from '../utils';

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    fullname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    permissions: [mongoose.Schema.Types.ObjectId],
    verified: { type: Boolean, default: false},
    signupVia: { type: String, default: 'email'},
    billingInfo: {type: Object, default: {}},
    isAdmin: {type: Boolean, default: false},
    refreshToken: String,
    passReset: {type: String, default: false}
});

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        this.password = Hash.makeHash(this.password);
    }
    next();
});

UserSchema.methods.filtered = function () {
    const {username, fullname, email, _id, isAdmin, permissions} = this;
    return {username, fullname, email, _id, isAdmin, permissions};
};
UserSchema.methods.validatePassword = function (password) {
    return Hash.compareHash(password, this.password);
  };

export default mongoose.model('User', UserSchema);