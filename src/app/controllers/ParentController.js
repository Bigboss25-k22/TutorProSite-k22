const Parent = require('../models/Parent'); 
const { mongooseToObject } = require('../../util/mongoose');
const { render } = require('node-sass');

class ParentController {
   
    async updateInforForm( req, res, next){
        res.render('/Parent/updateInfo');
    }

    async updateInfor(req, res, next) {
        try {
            // Lấy ID của parent hiện tại từ session hoặc JWT
            const parentId = req.user._id;

            // Lấy thông tin cần cập nhật từ form gửi lên
            const { name, phoneNumber, address } = req.body;

            // Tìm và cập nhật thông tin phụ huynh
            const updatedParent = await Parent.findByIdAndUpdate(
                parentId, // ID của phụ huynh
                {
                    name,
                    phoneNumber,
                    address,
                    
                },
                { new: true, runValidators: true } // Trả về parent sau khi cập nhật và kiểm tra validation
            );

            if (!updatedParent) {
                // Nếu không tìm thấy phụ huynh
                return res.status(404).send("Parent not found");
            }

            // Cập nhật thành công, chuyển hướng hoặc trả JSON
            res.redirect('/parents'); // Redirect đến danh sách hoặc trang thông tin phụ huynh
        } catch (error) {
            console.error(error);
            next(error); // Xử lý lỗi
        }
    }
    

}


module.exports = new ParentController();
