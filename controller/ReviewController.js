import ReviewModel from "../model/review.schema";

const ReviewController = {
    postReview : async (req, res) => {
        const {userId, content, rating, busId} = req.body;
        const rs = await ReviewModel.create({userId, content, rating});
        res.status(200).send(rs);
    }
}

export default ReviewController