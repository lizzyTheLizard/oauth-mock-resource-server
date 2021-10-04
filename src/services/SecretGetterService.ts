import { Jwt, Secret } from 'jsonwebtoken';
import axios from 'axios';
import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@utils/logger';

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
    const key = await this.getKeyFromIssuer(issuer, token.header.kid);
    this.checkKey(token, key);
    return key.n;
  }

  private async getKeyFromIssuer(issuer: string, kid: string | undefined): Promise<Key> {
    const openIdConfiguration = await this.getOpenIdConfiguration(issuer);
    const jwks = await this.getJwks(openIdConfiguration);
    const keys = jwks.keys;

    if (keys.length === 0) {
      throw new HttpException(500, 'No keys returned from issuer');
    }
    logger.debug('Keys returned from issuer', keys);

    //If not kid is set and this is the only key => fine
    if (!kid && keys.length == 1) {
      logger.debug('No KID and only one key => use it', keys[0]);
      return keys[0];
    }

    //If no kid is set and there are multiple keys => not good
    if (!kid) {
      throw new HttpException(400, 'Multiple keys returned from issuer, but none given in JWT');
    }

    //Otherwise find first matching key
    const matchingKey = keys.filter(key => key.kid == kid);
    if (matchingKey.length === 0) {
      throw new HttpException(400, 'No keys for kid returned from issuer');
    }
    logger.debug('Found matching keys for kid, use first', kid, matchingKey);
    return matchingKey[0];
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

  private async getJwks(openIdConfiguration: OpenIdConfiguration): Promise<Jwks> {
    try {
      const jwksResponse = await axios.get<Jwks>(openIdConfiguration.jwks_uri);
      return jwksResponse.data;
    } catch (e) {
      logger.info('Could not load jwks from issuer', e);
      throw new HttpException(500, 'Could not load jwks from issuer');
    }
  }

  private checkKey(token: Jwt, key: Key) {
    if (key.use !== 'sig') {
      throw new HttpException(400, 'Issuer returned a key not for siging');
    }

    if (token.header.alg && token.header.alg != key.alg) {
      throw new HttpException(400, 'Issuer returned a key from another algorithm');
    }
  }
}

export default SecretGetterService;
