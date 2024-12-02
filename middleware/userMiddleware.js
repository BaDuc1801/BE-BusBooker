import userModel from '../model/user.schema.js';
import jwt from 'jsonwebtoken'

const userMiddleware = {
    checkValidUser: async (req, res, next) => {
        const { email, password } = req.body;
        const existEmail = await userModel.findOne({ email })
        if (existEmail){
            return res.status(400).send("Email đã tồn tại!") 
        }
        else{
            next()
        }
    },
    verifyToken: async (req, res, next) => {
        try {
            const auth = req.headers['authorization'];
            if(auth){
                const token = auth.split(' ')[1];

                jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
                    if(err) {
                        return res.status(401).json({message: 'Access token is invalid'})
                    } else{
                        req.user = decoded;
                        next()
                    }
                })
            }
        } catch (error) {
            res.status(401).json({message: 'Access token is missing'})
        }
    }
}

export default userMiddleware;