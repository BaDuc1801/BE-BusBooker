import NotiModel from "../model/noti.schema.js";

const NotiController = {
    postNoti : async (req, res) => {
        let {username, phoneNumber, email} = req.body;
        let rs = await NotiModel.create({username, phoneNumber, email});
        res.status(200).send(rs)
    },

    getNoti : async (req, res) => {
        let rs = await NotiModel.find().sort({ read: 1 });
        res.status(200).send(rs)
    },

    getNotiById : async (req, res) => {
        let id = req.params.id;
        let rs = await NotiModel.find({_id : id});
        res.status(200).send(rs)
    },

    readNoti : async (req, res) => {
        const id = req.params.id;
        let rs = await NotiModel.findByIdAndUpdate({_id : id}, { read: true }, { new: true });
        res.status(200).send(rs);
    },
}

export default NotiController;