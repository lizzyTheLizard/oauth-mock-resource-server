process.env['NODE_CONFIG_DIR'] = __dirname + '/../configs';

import { HttpException } from '@/exceptions/HttpException';
import TokenVerifierService from '@/services/TokenVerifierService';
import 'dotenv/config';

const base64Token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXV0aC9yZWFsbXMvbWFzdGVyIn0.W4AwHc9qHQuBrmFSvqLt44pbY2j6GFPgyuWkr3pcWTg';
const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjN9.NOUocIfaeHejlAo3QDaWSH0tNJEupC1tVrgpPFz6470';
const notYetValidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJuYmYiOjE3MTYyMzkwMjN9.H8IUaMvxJtpHbtHKmr_XyWlkuGPlepgmypRXp85CaNg';
const token = {
  header: { alg: 'HS256', typ: 'JWT' },
  payload: {
    iat: 1516239022,
    iss: 'http://localhost:3000/auth/realms/master',
    name: 'John Doe',
    sub: '1234567890',
  },
  signature: 'W4AwHc9qHQuBrmFSvqLt44pbY2j6GFPgyuWkr3pcWTg',
};

describe('Testing TokenVerifierService', () => {
  it('Empty header', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.getBase64TokenFromHeader(undefined)).toThrow(HttpException);
  });

  it('Non bearer header', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.getBase64TokenFromHeader('Else')).toThrow(HttpException);
  });

  it('Empty token in header', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.getBase64TokenFromHeader('Bearer')).toThrow(HttpException);
  });

  it('Normal header', () => {
    const tokenService = new TokenVerifierService();
    expect(tokenService.getBase64TokenFromHeader('Bearer ' + base64Token)).toBe(base64Token);
  });

  it('Decode Invalid Token', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.decodeToken('INVALID')).toThrow(HttpException);
  });

  it('Decode Valid Token', () => {
    const tokenService = new TokenVerifierService();
    expect(tokenService.decodeToken(base64Token)).toStrictEqual(token);
  });

  it('Decode With Secret', () => {
    const tokenService = new TokenVerifierService();
    tokenService.verifyToken(base64Token, 'your-256-bit-secret');
  });

  it('Decode With Wrong Secret', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.verifyToken(base64Token, 'somethingElse')).toThrow(HttpException);
  });

  it('Decode Expired Token', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.verifyToken(expiredToken, 'your-256-bit-secret')).toThrow(HttpException);
  });

  it('Decode Not Yet Valid Token', () => {
    const tokenService = new TokenVerifierService();
    expect(() => tokenService.verifyToken(notYetValidToken, 'your-256-bit-secret')).toThrow(HttpException);
  });
});
