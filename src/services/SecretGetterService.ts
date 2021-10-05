import { Jwt, Secret } from 'jsonwebtoken';
import axios from 'axios';
import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@utils/logger';
import {JwksClient, SigningKey } from 'jwks-rsa';

interface Key {
  kid: string;
  n: string;
  use: string;
  alg: string;
}

interface OpenIdConfiguration {
  jwks_uri: string;
}

interface Jwks {
  keys: Key[];
}

class SecretGetterService {
  public async getSecret(token: Jwt): Promise<Secret> {
    return process.env.KEY ?? (await this.getSecretFromIssuer(token));
  }  

  public async getSecretFromIssuer(token: Jwt): Promise<Secret> {
    const issuer = token.payload.iss || process.env.ISSUER;
    logger.info('Try to get keys from issuer ' + issuer);
    const key = await this.getKeyFromIssuer(issuer, token.header.kid);
    return key.getPublicKey();
  }

  private async getKeyFromIssuer(issuer: string, kid: string | undefined): Promise<SigningKey> {
    const openIdConfiguration = await this.getOpenIdConfiguration(issuer);
    const client = new JwksClient({jwksUri: openIdConfiguration.jwks_uri});
    return client.getSigningKey(kid);
  }

  private async getOpenIdConfiguration(issuer: string): Promise<OpenIdConfiguration> {
    try {
      const wellKnownResponse = await axios.get<OpenIdConfiguration>(issuer + '/.well-known/openid-configuration');
      return wellKnownResponse.data;
    } catch (e) {
      logger.info('Could not load openid-configuration from issuer', e);
      throw new HttpException(500, 'Could not load openid-configuration from issuer');
    }
  }
}

export default SecretGetterService;
