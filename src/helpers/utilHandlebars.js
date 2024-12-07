const hbs = require('hbs');

// Helper để so sánh
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Helper để tạo dãy phân trang
hbs.registerHelper('createPagination', function(currentPage, totalPages) {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    return pages;
});

// Helper cộng số
hbs.registerHelper('add', function(value, addition) {
    return value + addition;
});

// Helper trừ số
hbs.registerHelper('sub', function(value, subtraction) {
    return value - subtraction;
});

// Helper so sánh lớn hơn
hbs.registerHelper('gt', function(arg1, arg2) {
    return arg1 > arg2;
});

// Helper so sánh nhỏ hơn
hbs.registerHelper('lt', function(arg1, arg2) {
    return arg1 < arg2;
});

