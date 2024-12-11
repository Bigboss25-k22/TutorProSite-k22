const Parent = require('../models/Parent'); 
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
}

module.exports = new ParentController();



module.exports = new ParentController();
