import { HttpException } from '@/exceptions/HttpException';
import { Jwt, Secret, decode, verify } from 'jsonwebtoken';
import { logger } from '@utils/logger';
import { isEmpty } from '@/utils/util';

class TokenVerifierService {
  public getBase64TokenFromHeader(authorizationHeader: string | undefined): string {
    if (isEmpty(authorizationHeader)) {
      throw new HttpException(400, 'No authorization header sent');
    }
    logger.debug('Got Authorization Header', authorizationHeader);

    //Check if first part is 'Bearer'
    if (!authorizationHeader.startsWith('Bearer ')) {
      throw new HttpException(400, 'Authentication header not a bearer token');
    }

    //So the rest is the token
    const base64Token = authorizationHeader.substring(7);
    if (base64Token.length == 0) {
      throw new HttpException(400, 'Authentication header does not contain a token');
    }
    logger.debug('Base64-Token is', authorizationHeader);
    return base64Token;
  }

  public decodeToken(base64Token: string): Jwt {
    try {
      const token = decode(base64Token, { complete: true });
      logger.debug('Got Token', token);
      return token;
    } catch (e) {
      logger.info('Could not decode token', e);
      throw new HttpException(400, 'Token is not not a valid JWT');
    }
  }

  public verifyToken(base64Token: string, keyOrSecret: Secret) {
    try {
      verify(base64Token, keyOrSecret, {});
    } catch (e) {
      logger.info('Could not verify code token', e);
      throw new HttpException(400, 'Token is not valid');
    }
  }
}

export default TokenVerifierService;