const Parent = require('../models/Parent'); 
const Review = require('../models/Review');
const Tutor = require('../models/Tutor');
const Course = require('../models/Course');

class ReviewController {
    // Hiển thị form đánh giá
    async showReviewForm(req, res, next) {
        try {
            const slug = req.params.slug; 
            const tutor = await Tutor.findOne({ slug });

            if (!tutor) {
                return res.status(404).json({ message: "Tutor not found" });
            }

            res.status(200).json({ tutorSlug: slug });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving tutor information', error });
        }
    }

    // Lấy danh sách đánh giá
    async getReviews(req, res, next) {
        try {
            const slug = req.params.slug;
    
            // Tìm gia sư dựa vào slug
            const tutor = await Tutor.findOne({ slug });
    
            if (!tutor) {
                return res.status(404).json({ message: "Tutor not found" });
            }
    
            // Lấy danh sách đánh giá dựa trên tutorId
            const reviews = await Review.find({ tutorId: tutor._id }).populate("parentId", "name");
    
            // Trả về danh sách đánh giá dưới dạng JSON
            res.status(200).json({
                message: 'Reviews retrieved successfully',
                reviews: reviews.map(review => ({
                    id: review._id,
                    parentName: review.parentId.name,
                    reviewValue: review.rating, // Hoặc đổi thành review nếu đã thay đổi schema
                    comment: review.comment,
                    createdAt: review.createdAt,
                })),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving reviews', error });
        }
    }
    

    // Xử lý đánh giá
    async submitReview(req, res, next) {
        try {
            const slug = req.params.slug; // Lấy slug từ URL
            const parentId = req.user.id; // ID của phụ huynh từ session/JWT
            const { rating, comment } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (typeof rating !== 'number' || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Invalid review value' });
            }

            // Tìm gia sư dựa trên slug
            const tutor = await Tutor.findOne({ slug });

            if (!tutor) {
                return res.status(404).json({ message: "Tutor not found" });
            }

            const courses = await Course.find({ tutor_id: tutor._id, parent_id: parentId });
            if (courses.length === 0) {
                return res.status(400).json({ message: "You have not registered any courses with this tutor." });
            }

            // Kiểm tra nếu phụ huynh đã đánh giá gia sư này
            const existingReview = await Review.findOne({ tutorId: tutor._id, parentId });
            if (existingReview) {
                return res.status(400).json({ message: "You have already reviewed this tutor." });
            }

            // Lưu đánh giá
            const newReview = new Review({
                tutorId: tutor._id,
                parentId,
                rating,
                comment,
            });

            await newReview.save();

            // Tính điểm trung bình mới
            const reviews = await Review.find({ tutorId: tutor._id });
            const averageReview = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

            // Cập nhật review của Tutor
            await Tutor.findByIdAndUpdate(
                tutor._id,
                { rating: averageReview },
                { new: true }
            );

            res.status(200).json({
                message: 'Review submitted successfully',
                tutorSlug: slug,
                averageReview,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error submitting review', error });
        }
    }
}

module.exports = new ReviewController();







