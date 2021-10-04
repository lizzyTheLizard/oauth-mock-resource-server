import SecretGetterService from '@/services/SecretGetterService';
import TokenVerifierService from '@/services/TokenVerifierService';
import { NextFunction, Request, Response } from 'express';

class InfoController {
  constructor(private readonly tokenVerifier: TokenVerifierService, private readonly secretGetter: SecretGetterService) {}

  public userInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const base64Token = this.tokenVerifier.getBase64TokenFromHeader(req.headers.authorization);
      const token = this.tokenVerifier.decodeToken(base64Token);
      const keyOrSecret = await this.secretGetter.getSecret(token);
      this.tokenVerifier.verifyToken(base64Token, keyOrSecret);
      res.status(200).json(token.payload);
    } catch (error) {
      next(error);
    }
  };
}

export default InfoController;
