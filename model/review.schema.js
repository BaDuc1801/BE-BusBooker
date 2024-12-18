import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', 
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, 
      max: 5, 
    },
    createdAt: {
      type: Date,
      default: Date.now, // Ghi lại thời gian tạo đánh giá
    },
  },
  { timestamps: true } // Tạo trường createdAt và updatedAt tự động
);

const ReviewModel = mongoose.model('reviews', reviewSchema);

export default ReviewModel
