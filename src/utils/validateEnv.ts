import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port({default: 3000}),
    KEY: str({default: undefined}),
    ISSUER: str({default: undefined}),
  });
};

export default validateEnv;
