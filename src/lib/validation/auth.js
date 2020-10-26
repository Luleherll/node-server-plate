import JOI from '@hapi/joi';

const userDTO = {
  username: JOI.string().alphanum().max(20).required(),
  fullname: JOI.string().required(),
  email: JOI.string().email().required(),
  password: JOI.string().pattern(new RegExp(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}$/)),
  signupVia: JOI.string().default('email')
};

const signUp = JOI.object({...userDTO, password: userDTO.password.required()});

const updateUser = JOI.object({
  username: JOI.string().alphanum().max(20),
  fullname: JOI.string(),
  email: JOI.string().email(),
});

const login = JOI.object({email: userDTO.email, password: userDTO.password});
const passwordReset = JOI.object({newPassword: userDTO.password, confirmPassword: JOI.ref('newPassword')}).with('newPassword', 'confirmPassword');
const forgotPassword = JOI.object({email: userDTO.email});

export { signUp, updateUser, login, passwordReset, forgotPassword };