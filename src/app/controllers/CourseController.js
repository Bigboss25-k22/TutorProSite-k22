const Course = require("../models/Course");
const {
  mongooseToObject,
  multipleMongooseToObject,
} = require("../../util/mongoose");
const Registration = require("../models/Registration");

class CourseController {
  // [GET] /courses
  async show(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Trang hiện tại
      const limit = parseInt(req.query.limit) || 10; // Số lượng khóa học mỗi trang
      const skip = (page - 1) * limit; // Số lượng bỏ qua để lấy trang hiện tại

      // Đếm tổng số khóa học
      const total = await Course.countDocuments({ status: "Đã duyệt" });

      // Lấy danh sách khóa học với phân trang
      const courses = await Course.find({ status: "Đã duyệt" })
        .skip(skip)
        .limit(limit);

      // Tính tổng số trang
      const totalPages = Math.ceil(total / limit);

      // Trả về danh sách khóa học và thông tin phân trang
      res.json({
        courses: multipleMongooseToObject(courses), // Chuyển đổi dữ liệu Mongoose Object
        pagination: {
          currentPage: page,
          totalPages,
          total,
        },
      });
    } catch (error) {
      next(error); // Xử lý lỗi
    }
  }

  async showDetail(req, res, next) {
    try {
      const slug = req.params.slug; // Lấy slug từ URL
      const course = await Course.findOne({ slug });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json({
        course: mongooseToObject(course),
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error retrieving course details", error });
    }
  }

  // [POST] /create
  async createCourse(req, res, next) {
    try {
      const {
        parent_id,
        subject,
        grade,
        address,
        salary,
        sessions,
        schedule,
        studentInfo,
        requirements,
        teachingMode,
        contact,
        sexTutor,
      } = req.body;

      const newCourse = new Course({
        parent_id,
        tutor_id: null,
        subject,
        grade,
        address,
        salary,
        sessions,
        schedule,
        studentInfo,
        requirements,
        teachingMode,
        contact,
        sexTutor,
        slug: subject,
      });

      await newCourse.save();

      res.status(201).json({
        message: "Course created successfully",
        course: mongooseToObject(newCourse),
      });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /search
  async SearchCourse(req, res, next) {
    try {
      const keyword = req.query.keyword || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const courses = await Course.find({
        title: { $regex: keyword, $options: "i" },
      })
        .skip(skip)
        .limit(limit);

      const totalCourses = await Course.countDocuments({
        title: { $regex: keyword, $options: "i" },
      });

      res.json({
        data: multipleMongooseToObject(courses),
        pagination: {
          total: totalCourses,
          page,
          limit,
          totalPages: Math.ceil(totalCourses / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async registerCourse(req, res, next) {
    try {
      // Get tutor ID from session or JWT (assuming req.user contains the logged-in tutor's info)
      const tutorId = req.user.id;

      // Get course ID from the request body
      const { courseId } = req.body;

      // Create a new registration entry
      const newRegistration = new Registration({
        userId: tutorId,
        courseId: courseId,
        status: "pending",
      });

      await newRegistration.save();

      // Registration successful, send JSON response
      res.status(200).json({ message: "Đăng ký khóa học thành công" });
    } catch (error) {
      console.error(error);
      next(error); // Handle error
    }
  }

  // [GET] /filter
  async getFilteredCourses(req, res, next) {
    try {
      const {
        subject: courseSubject,
        grade: courseGrade,
        address: courseAddress,
        teachingMode: courseTeachingMode,
        sexTutor: courseSexTutor,
        page = 1,
        limit = 10,
        keyword,
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const filters = {};

      if (keyword) {
        filters.name = { $regex: keyword, $options: "i" };
      }
      if (courseSubject) {
        filters.subject = { $in: courseSubject.split(",") };
      }
      if (courseGrade) {
        filters.grade = { $in: courseGrade.split(",") };
      }
      if (courseAddress) {
        filters.address = { $in: courseAddress.split(",") };
      }
      if (courseTeachingMode) {
        filters.teachingMode = { $in: courseTeachingMode.split(",") };
      }
      if (courseSexTutor) {
        filters.sexTutor = { $in: courseSexTutor.split(",") };
      }

      const total = await Course.countDocuments(filters);
      const courses = await Course.find(filters)
        .skip(skip)
        .limit(parseInt(limit));

      res.json({
        courses: multipleMongooseToObject(courses),
        pagination: {
          total,
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error filtering courses:", error);
      res.status(500).json({ message: "Error filtering courses", error });
    }
  }

  // [Put] /courses/
  async updateCourse(req, res, next) {
    try {
      const { id } = req.body;
      const updateData = req.body;

      // Đảm bảo trạng thái được đặt lại thành "Chưa duyệt"
      updateData.status = "Chưa duyệt";

      const course = await Course.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating course", error });
    }
  }

  async deleteCourse(req, res, next) {
    try {
      const { id } = req.body;

      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting course", error });
    }
  }
}

module.exports = new CourseController();
