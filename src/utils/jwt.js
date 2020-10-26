import * as JWT from 'jsonwebtoken';

let instance = null;
export default class JwtUtil {

  constructor(JWT_ISSUER, JWT_SECRET, EXPIRATION) {
    if (!instance) {
      this.JWT_ISSUER = JWT_ISSUER;
      this.JWT_SECRET = JWT_SECRET;
      this.expires = EXPIRATION;
      instance = this;
    }
    return instance;
  }

  /**
   * Generate JWT token
   * @param {} subject
   * @param {} expires
   * @returns JWT token
   */
  signToken = (sub, exp = null) => {
    console.log('kkkk',sub);
    const token = {
      iss: this.JWT_ISSUER,
      sub,
      iat: new Date().getTime(),
    };

    return exp ? JWT.sign({ ...token, exp }, this.JWT_SECRET) : JWT.sign(token, this.JWT_SECRET);
  };

  /**
   * Generate expiring token
   * @param  {} payload
   * @param  {} expires
   * @returns JWT token
   */
  getExpiringToken = (payload) => this.signToken(payload, this.expires);

  /**
   * Generate a refresher token
   * @param  {} payload
   * @returns JWT token
   */
  getRefreshToken = (payload) => this.signToken(payload);

  /**
   * Decodes JWT token
   * @param  {} token
   * @returns {} subject
   */
  decodeToken = (token) => {
    let subject = { error: null, value: null };
    try {
      subject.value = JWT.verify(token, this.JWT_SECRET).sub;
    } catch (e) {
      subject.error = e.message === 'jwt expired' ? e.message : { message: e.message, token };
      return subject;
    }
    return subject;
  };
}