import bcrypt from 'bcrypt';

const makeHash = (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10));
const compareHash = (value, hash) => bcrypt.compareSync(value, hash);

export { makeHash, compareHash };