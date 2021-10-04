import { Router } from 'express';
import InfoController from '@/controllers/info.controller';
import { Routes } from '@interfaces/routes.interface';

class InfoRoute implements Routes {
  public path = '/info';
  public router = Router();

  constructor(private readonly infoController: InfoController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.infoController.userInfo);
  }
}

export default InfoRoute;
