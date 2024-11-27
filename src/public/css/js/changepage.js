document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search); // Lấy tham số từ URL
    const currentPage = parseInt(urlParams.get('page')) || 1; // Lấy giá trị của tham số 'page', mặc định là 1

    // Gọi API để lấy danh sách khóa học ban đầu
    loadCourses(currentPage);
});

function loadCourses(page) {
    fetch(`/courses?page=${page}`)
        .then(response => response.json())
        .then(data => {
            updateCourseList(data.courses); // Cập nhật danh sách khóa học
            updatePagination(data.currentPage, data.totalPages); // Cập nhật phân trang
        })
        .catch(error => console.error('Error:', error));
}

// Hàm để cập nhật danh sách khóa học
function updateCourseList(courses) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = ''; // Xóa danh sách khóa học hiện tại

    // Render từng khóa học
    courses.forEach(course => {
        courseList.innerHTML += `
            <div class="col-lg-4 col-md-6">
                <div class="single-course">
                    <a href="/course/${course._id}">
                        <img class="img-fluid" src="${course.image}" alt="${course.name}">
                    </a>
                    <div class="course-details">
                        <a href="/course/${course._id}">
                            <h6>${course.name}</h6>
                        </a>
                        <p>${course.description}</p>
                        <div class="price">
                            <h6>${course.fee} VND</h6>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Hàm để cập nhật phân trang
function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Xóa nội dung phân trang cũ

    if (currentPage > 1) {
        paginationContainer.innerHTML += `<a href="#" class="prev-arrow" onclick="changePage(${currentPage - 1})">Previous</a>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `<a href="#" class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</a>`;
    }

    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `<a href="#" class="next-arrow" onclick="changePage(${currentPage + 1})">Next</a>`;
    }
}

// Hàm để thay đổi trang
function changePage(page) {
    loadCourses(page); // Tải dữ liệu khóa học cho trang mới
}

//gia sư
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search); // Lấy tham số từ URL
    const currentPage = parseInt(urlParams.get('page')) || 1; // Lấy giá trị của tham số 'page', mặc định là 1

    // Gọi API để lấy danh sách gia sư ban đầu
    loadTutors(currentPage);
});

function loadTutors(page) {
    fetch(`/tutors?page=${page}`)
        .then(response => response.json())
        .then(data => {
            displayTutors(data.tutors);  // Hiển thị danh sách gia sư
            createPagination(data.currentPage, data.totalPages); // Tạo phân trang
        })
        .catch(error => console.error('Error fetching tutors:', error));
}

function displayTutors(tutors) {
    const tutorsList = document.getElementById('tutors-list');
    tutorsList.innerHTML = ''; // Xóa nội dung cũ trước khi thêm gia sư mới

    tutors.forEach(tutor => {
        const tutorElement = document.createElement('div');
        tutorElement.classList.add('tutor-item');
        tutorElement.innerHTML = `
            <h3>${tutor.name}</h3>
            <p>${tutor.subject}</p>
            <p>${tutor.experience} years of experience</p>
        `;
        tutorsList.appendChild(tutorElement);
    });
}

function createPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Xóa các phần tử phân trang cũ

    // Thêm liên kết trang trước
    if (currentPage > 1) {
        const prevPageLink = document.createElement('a');
        prevPageLink.href = `?page=${currentPage - 1}`;
        prevPageLink.classList.add('prev');
        prevPageLink.textContent = 'Previous';
        paginationContainer.appendChild(prevPageLink);
    }

    // Thêm các liên kết số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = `?page=${i}`;
        pageLink.classList.add('page-number');
        if (i === currentPage) {
            pageLink.classList.add('active'); // Đánh dấu trang hiện tại
        }
        pageLink.textContent = i;
        paginationContainer.appendChild(pageLink);
    }

    // Thêm liên kết trang sau
    if (currentPage < totalPages) {
        const nextPageLink = document.createElement('a');
        nextPageLink.href = `?page=${currentPage + 1}`;
        nextPageLink.classList.add('next');
        nextPageLink.textContent = 'Next';
        paginationContainer.appendChild(nextPageLink);
    }
}
