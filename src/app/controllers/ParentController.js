const Parent = require('../models/Parent'); 
const Rating = require('../models/Review');
const Tutor = require('../models/Tutor');

const { mongooseToObject } = require('../../util/mongoose');
const { render } = require('node-sass');



class ParentController {
    async updateInforForm(req, res, next) {
        try {
            res.status(200).json({ message: 'Update information form endpoint' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    // async updateInforForm( req, res, next){
    //     res.render('/Parent/updateInfo');
    // }

    async updateInfor(req, res, next) {
        try {
            const parentId = req.user.id;
            const { name, phoneNumber, address } = req.body;

            const updatedParent = await Parent.findByIdAndUpdate(
                parentId,
                { name, phoneNumber, address },
                { new: true, runValidators: true }
            );

            if (!updatedParent) {
                return res.status(404).json({ message: "Parent not found" });
            }

            res.status(200).json({
                message: 'Parent information updated successfully',
                parent: mongooseToObject(updatedParent),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred', error });
        }
    }

    async showRatingForm(req, res, next) {
        try {
            const slug = req.params.slug; // Lấy slug từ URL
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
    

    // Xử lý đánh giá
    async submitRating(req, res, next) {
        try {
            const slug = req.params.slug; // Lấy slug từ URL
            const parentId = req.user.id; // ID của phụ huynh từ session/JWT
            const { rating, comment } = req.body;
            console.log(slug);
    
            // Kiểm tra dữ liệu đầu vào
            if (typeof rating !== 'number' || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Invalid rating value' });
            }
    
            // Tìm gia sư dựa trên slug
            const tutor = await Tutor.findOne({ slug });
    
            if (!tutor) {
                return res.status(404).json({ message: "Tutor not found" });
            }
    
            // Kiểm tra nếu phụ huynh đã đánh giá gia sư này
            const existingRating = await Rating.findOne({ tutorId: tutor._id, parentId });
            if (existingRating) {
                return res.status(400).json({ message: "You have already rated this tutor." });
            }
    
            // Lưu đánh giá
            const newRating = new Rating({
                tutorId: tutor._id,
                parentId,
                rating,
                comment,
            });
    
            await newRating.save();
    
            // Tính điểm trung bình mới
            const ratings = await Rating.find({ tutorId: tutor._id });
            const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
            // Cập nhật rating của Tutor
            await Tutor.findByIdAndUpdate(
                tutor._id,
                { rating: averageRating },
                { new: true }
            );
    
            res.status(200).json({
                message: 'Rating submitted successfully',
                tutorSlug: slug,
                averageRating,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error submitting rating', error });
        }
    }
    
    

}

module.exports = new ParentController();



module.exports = new ParentController();
