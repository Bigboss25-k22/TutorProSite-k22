const Tutor = require('../models/Tutor'); 
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');

class TutorController {
    async show(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
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

            // res.render('Tutor/tutors',({
            //     data: tutors.map(tutor => mongooseToObject(tutor)),
            //     pagination: { total, currentPage: page, totalPages, limit },
            // }));
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
    

   

    async SearchTutors(req, res, next) {
        try {
            const keyword = req.query.keyword || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
    
            const tutors = await Tutor.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { specialization: { $regex: keyword, $options: 'i' } }
                ]
            })
            .skip(skip)
            .limit(limit);
    
            const totalTutors = await Tutor.countDocuments({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { specialization: { $regex: keyword, $options: 'i' } }
                ]
            });
    
            res.json({
                data: multipleMongooseToObject(tutors),
                pagination: {
                    total: totalTutors,
                    currentPage: page,
                    totalPages: Math.ceil(totalTutors / limit),
                },
            });
        } catch (error) {
            console.error('Error searching tutors:', error);
            next(error);
        }
    }
    

    // [GET] /filter
    async getFilteredTutors(req, res, next) {
        try {
            const {
                sex:tutorsex,
                address: tutorAddress,
                specialization: tutorSpecialization,
                status: tutorStatus,
                ratingMin,
                ratingMax,
                page = 1,
                limit = 10,
                keyword,
            } = req.query;
    
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const filters = {};
    
            if (keyword) {
                filters.$or = [
                    { name: { $regex: keyword, $options: 'i' } },
                    { specialization: { $regex: keyword, $options: 'i' } },
                ];
            }
            if (tutorAddress) {
                filters.address = { $in: tutorAddress.split(',') };
            }
            if (tutorsex) {
                filters.sex = { $in: tutorsex.split(',') };
            }
            if (tutorSpecialization) {
                filters.specialization = { $in: tutorSpecialization.split(',') };
            }
            if (tutorStatus) {
                filters.status = { $in: tutorStatus.split(',') };
            }
            if (ratingMin || ratingMax) {
                filters.rating = {};
                if (ratingMin) filters.rating.$gte = parseFloat(ratingMin);
                if (ratingMax) filters.rating.$lte = parseFloat(ratingMax);
            }
    
            const total = await Tutor.countDocuments(filters);
            const tutors = await Tutor.find(filters)
                .skip(skip)
                .limit(parseInt(limit));
    
            res.json({
                tutors: multipleMongooseToObject(tutors),
                pagination: {
                    total,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            console.error('Error filtering tutors:', error);
            res.status(500).json({ message: 'Error filtering tutors', error });
        }
    }
    
    
}

module.exports = new TutorController();




