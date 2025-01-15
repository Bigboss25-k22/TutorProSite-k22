require('dotenv').config();

function removeVietnameseTones(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

function removeWhitespaceAndHyphen(str) {
    return str.replace(/[\s-]+/g, ""); // Loại bỏ tất cả khoảng trắng và ký tự '-'
}



async function checkPaid(price, description) {
    try {
        const response = await fetch(process.env.PAYMENT_API);
        const data = await response.json();
        const lastPaid = data.data[data.data.length - 1];
        const lastPrice = parseInt(lastPaid["Giá trị"], 10);
        const lastContent = removeVietnameseTones(lastPaid["Mô tả"]);
        //const mainContent=removeWhitespace(lastContent);
        const normalizedDescription = removeWhitespaceAndHyphen(description);
        console.log(normalizedDescription);

        if (lastPrice >= price && lastContent.includes(normalizedDescription)) {
            return { success: true };
        } else {
            return { success: false, reason: "Payment details do not match" };
        }
    } catch (error) {
        console.error("Error checking payment:", error);
        return { success: false, reason: "API error" };
    }
}

module.exports = {
   
    checkPaid,
};
