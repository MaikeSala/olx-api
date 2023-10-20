import { Router } from "express";
import * as AuthController from '../controllers/AuthController';
import * as UserController from '../controllers/UserController';
import * as AdsController from '../controllers/AdsController';
import * as Auth from '../middlewares/Auth';
import * as AuthValidator from '../validator/AuthValidator';
import * as UserValidator from '../validator/UserValidator';

const router = Router();

router.get('/states', UserController.getStates);

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.get('/user/me',Auth.privates, UserController.info);
router.put('/user/me',UserValidator.editAction, Auth.privates, UserController.editAction);

router.get('/categories', AdsController.getCategories);

router.post('/ad/add',Auth.privates, AdsController. addAction);
router.get('/ad/list', AdsController.getList);
router.get('/ad/item', AdsController.getItem);
router.post('/ad/:id',Auth.privates, AdsController.editAction);

export default router;