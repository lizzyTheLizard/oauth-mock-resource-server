process.env['NODE_CONFIG_DIR'] = __dirname + '/../configs';

import TokenVerifierService from '@/services/TokenVerifierService';
import 'dotenv/config';

describe('Testing TokenVerifierService', () => {
  it('Can construst service', () => {
    new TokenVerifierService();
  });
});
