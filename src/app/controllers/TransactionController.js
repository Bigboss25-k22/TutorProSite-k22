const Transaction = require('../models/Transaction');
const Tutor = require('../models/Tutor');
const Course = require('../models/Course');
const dotenv = require('dotenv');
const {checkPaid } = require('../../util/payment');

dotenv.config(); // Load environment variables

require('dotenv').config(); // Load environment variables from .env

class TransactionController {
    
    // Lấy danh sách giao dịch của gia sư
    async getTransactionsByTutor(req, res, next) {
        try {
            const tutorId = req.user.id; // ID gia sư từ token

            // Truy xuất các giao dịch
            const transactions = await Transaction.find({ tutorId })
                .sort({ createdAt: -1 });

            if (!transactions.length) {
                return res.status(404).json({ message: 'No transactions found' });
            }

            res.status(200).json({
                message: 'Transactions retrieved successfully',
                transactions,
            });
        } catch (error) {
            console.error('Error retrieving transactions:', error);
            res.status(500).json({ message: 'Error retrieving transactions', error });
        }
    }

    async getTransactionById(req, res, next) {
        try {
          const { transactionId } = req.params;
          const tutorId = req.user.id;
      
          // Tìm giao dịch
          const transaction = await Transaction.findOne({ _id: transactionId, tutorId });
          if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
          }
      
          // Tạo URL mã QR dựa trên thông tin giao dịch
          const bankInfo = {
            id: process.env.BANK_ID,
            accountNo: process.env.ACCOUNT_NO,
            accountName: process.env.ACCOUNT_NAME,
            template: process.env.TEMPLATE,
          };
      
          const qrCodeData = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${transaction.amount}&addInfo=${encodeURIComponent(transaction.description)}&accountName=${bankInfo.accountName}`;
      
          res.status(200).json({
            message: 'Transaction retrieved successfully',
            transaction,
            qrCode: qrCodeData, // Trả về mã QR
          });
        } catch (error) {
          console.error('Error retrieving transaction:', error);
          res.status(500).json({ message: 'Error retrieving transaction', error });
        }
      }
      
      

    // Tạo giao dịch thanh toán
    async createTransaction(req, res, next) {
        try {

            console.log('Request Body:', req.body);
            console.log('Request Params:', req.params);
            console.log('Authenticated User:', req.user);

            const bankInfo = {
                id: process.env.BANK_ID,
                accountNo: process.env.ACCOUNT_NO,
                accountName: process.env.ACCOUNT_NAME,
                template: process.env.TEMPLATE,
            };
    
            const {  paymentMethod } = req.body; // Không cần truyền `description`
            const slug = req.params.slug; // Lấy slug của khóa học từ URL
            const tutorId = req.user.id; // ID gia sư từ token
    
            // if (!amount || amount <= 0) {
            //     return res.status(400).json({ message: 'Invalid amount' });
            // }
    
            // Tìm khóa học
            const course = await Course.findOne({ slug });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
    
            const courseId = course._id;
            const amount=course.fee;
            // Tạo giao dịch mới với description tạm thời
            let newTransaction = new Transaction({
                tutorId,
                amount:amount,
                paymentMethod,
                courseId,
                description: 'Temporary description', // Tạm thời
                status: 'pending',
            });
    
            // Lưu giao dịch
            newTransaction = await newTransaction.save();
    
            // Cập nhật description với transactionId
            newTransaction.description = `CourseID-${courseId}-Trans-${newTransaction._id}`;
            await newTransaction.save();
    
            const qrCodeData = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.accountNo}-${bankInfo.template}.png?amount=${amount}&addInfo=${encodeURIComponent(newTransaction.description)}&accountName=${bankInfo.accountName}&transactionId=${newTransaction._id}`;
    
            res.status(201).json({
                message: 'Transaction created successfully',
                transaction: newTransaction,
                qrCode: qrCodeData,
            });
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ message: 'Error creating transaction', error });
        }
    }
    
    
    // Thanh toán và cập nhật trạng thái giao dịch và lớp học
    async processPayment(req, res, next) {
       
        try {
           
            const { transactionId } = req.body;
            const tutorId = req.user.id; // ID của gia sư từ token
    
            // Tìm giao dịch
            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
          
            // Kiểm tra nếu trạng thái hiện tại của giao dịch là 'pending'
            if (transaction.status !== 'pending') {
                return res.status(400).json({ message: 'Transaction is not pending' });
            }
    
          
    
            // Kiểm tra thanh toán trong 5 phút
            const checkInterval = 10 * 1000; // 10 giây
            const timeout = 5 * 60 * 1000; // 5 phút
            let elapsed = 0;
    
            const checkPaymentStatus = async () => {
                if (elapsed >= timeout) {
                    // Quá thời gian, cập nhật trạng thái giao dịch thành 'failed'
                    transaction.status = 'failed';
                   // transaction.failureReason = 'Payment timeout';
                    await transaction.save();
                    console.log('Transaction failed due to timeout:', transactionId);
                    return;
                }
    
                // Kiểm tra trạng thái thanh toán từ API
                const isPaid = await checkPaid(transaction.amount, transaction.description);
                console.log(transaction);
                if (isPaid.success) {
                    // Thanh toán thành công
                    transaction.status = 'completed';
                    await transaction.save();
                    
                   
                    //Cập nhật trạng thái của khóa học
                    const course = await Course.findById(transaction.courseId);
                    if (course) {
                        course.tutor_id = tutorId;
                        await course.save();
                    }
    
                    console.log('Transaction completed:', transactionId);
                    return res.json({ message: 'Transaction completed successfully', transaction });
                }
    
                elapsed += checkInterval;
                setTimeout(checkPaymentStatus, checkInterval);
            };
    
            checkPaymentStatus();
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ message: 'Error processing payment', error });
        }
    }
    
    



    // Lấy tất cả giao dịch (chỉ dành cho admin)
    async getAllTransactions(req, res, next) {
        try {
           
            const transactions = await Transaction.find().sort({ createdAt: -1 });
            res.status(200).json({
                message: 'All transactions retrieved successfully',
                transactions,
            });
        } catch (error) {
            console.error('Error retrieving all transactions:', error);
            res.status(500).json({ message: 'Error retrieving all transactions', error });
        }
    }


}

module.exports = new TransactionController();
