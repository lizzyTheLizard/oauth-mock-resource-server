process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import InfoRoute from '@/routes/info.route';
import InfoController from './controllers/info.controller';
import TokenVerifierService from './services/TokenVerifierService';
import SecretGetterService from './services/SecretGetterService';

validateEnv();

//Manual dependency injection
const tokenVerifierService = new TokenVerifierService();
const secretGetterService = new SecretGetterService();
const infoController = new InfoController(tokenVerifierService, secretGetterService);
const infoRoute = new InfoRoute(infoController);

const app = new App([infoRoute]);
app.listen();
