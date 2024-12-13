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
        const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=M58C6O-90DDGYlaDJmXX3JrA_yJHD47P091uMLQQbugPvhzTK43gQ9lgkbBCsRF-Phnxxdp3s2J6VRCvd_0fe7XErsJqEtSem5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKfR2S4I563Nwr1MhF95pI1y5Ct-GMUCsYQ7S_SuhiLJVa2sm447-s78wdFEfDBg89K4j4CcvwNVfRppXMJo5bkfxxMg--JwxQ&lib=MdDEL8iyKTVTgWPGij_Q9AmWDIxTrJnKJ");
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
