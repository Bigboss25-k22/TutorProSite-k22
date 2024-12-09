const Tutor = require('../models/Tutor'); 
const { mongooseToObject } = require('../../util/mongoose');
const { render } = require('node-sass');

class TutorController {
    async show(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 2;
            const skip = (page - 1) * limit;

            const total = await Tutor.countDocuments({ status: 'Đã duyệt' });
            const tutors = await Tutor.find({ status: 'Đã duyệt' })
                                      .skip(skip)
                                      .limit(limit);

            const totalPages = Math.ceil(total / limit);

            res.status(200).json({
                data: tutors.map(tutor => mongooseToObject(tutor)),
                pagination: { total, currentPage: page, totalPages, limit },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching tutors', error });
        }
    }

    async updateInforForm(req, res, next) {
        try {
            res.status(200).json({ message: 'Update information form endpoint' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async updateInfor(req, res, next) {
        try {
            const tutorId = req.user.id;
            const { name, address, introduction, phoneNumber, specialization } = req.body;

            const updatedTutor = await Tutor.findByIdAndUpdate(
                tutorId,
                { name, phoneNumber, address, introduction, specialization },
                { new: true, runValidators: true }
            );

            if (!updatedTutor) {
                return res.status(404).json({ message: "Tutor not found" });
            }

            res.status(200).json({
                message: 'Tutor information updated successfully',
                tutor: mongooseToObject(updatedTutor),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating tutor information', error });
        }
    }

    async showDetail(req, res,next) {
        try {
            // Lấy slug từ params
            const slug = req.params.slug;
    
            // Tìm tutor theo slug
            const tutor = await Tutor.findOne({ slug });
    
            if (!tutor) {
                return res.status(404).json({ message: 'Tutor not found' });
            }
    
            // Trả về thông tin gia sư
            res.status(200).json({
                message: 'Tutor details retrieved successfully',
                tutor: mongooseToObject(tutor),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching tutor details', error });
        }
    }
    

    async getRatings(req, res, next) {
        try {
            const tutorId = req.params.tutorId;
            const ratings = await Rating.find({ tutorId }).populate("parentId", "name");
    
            // Trả về danh sách đánh giá dưới dạng JSON
            res.status(200).json({
                message: 'Ratings retrieved successfully',
                ratings: ratings.map(rating => ({
                    id: rating._id,
                    parentName: rating.parentId.name,
                    ratingValue: rating.rating,
                    comment: rating.comment,
                    createdAt: rating.createdAt
                }))
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving ratings', error });
        }
    }
    
}

module.exports = new TutorController();




