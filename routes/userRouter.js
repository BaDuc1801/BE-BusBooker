import express from 'express'
import userController from '../controller/userController.js';
import multer from 'multer';
import userMiddleware from '../middleware/userMiddleware.js';

const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
})
userRouter.get('/', userController.getUsers);
userRouter.get('/infor', userMiddleware.verifyToken, userController.getUserById)
userRouter.put('/email', userController.updateUserByEmail);
userRouter.post('/register', userMiddleware.checkValidUser, userController.register);
userRouter.put('/up-avatar', userMiddleware.verifyToken, upload.single('avatar'), userController.uploadAvatar);
userRouter.post('/login', userController.login);
userRouter.post('/forgot', userController.forgotPass);
userRouter.put('/update-user', userMiddleware.verifyToken, userController.updateUser)
userRouter.put('/change-password', userMiddleware.verifyToken, userController.changePassword)
userRouter.put('/reset-pass', userController.resetPass);
userRouter.put('/userId/:id', userController.updateUserById);
userRouter.delete('/:id', userController.delUser)
userRouter.post('/logout', userController.logout);
userRouter.post('/forgot-password', userController.sendEmail);
userRouter.post('/refresh-token', userController.refreshAccessToken);

export default userRouter