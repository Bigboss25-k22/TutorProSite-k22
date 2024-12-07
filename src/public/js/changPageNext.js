document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    let filters = {
        keyword: urlParams.get('keyword') || '',
        subject: urlParams.get('subject')?.split(',') || [],
        grade: urlParams.get('grade')?.split(',') || [],
        teachingMode: urlParams.get('teachingMode')?.split(',') || [],
        sexTutor: urlParams.get('sexTutor')?.split(',') || [],
        page: parseInt(urlParams.get('page')) || 1,
        limit: parseInt(urlParams.get('limit')) || 2,
    };

    const searchInput = document.getElementById('search_input');
    const courseList = document.getElementById('course-list');
    const paginationContainer = document.getElementById('pagination');

    // Set initial search value
    if (filters.keyword) searchInput.value = filters.keyword;

    // Apply filters and fetch data
    function applyFilters() {
        const query = new URLSearchParams({
            ...filters,
            subject: filters.subject.join(','),
            grade: filters.grade.join(','),
            teachingMode: filters.teachingMode.join(','),
            sexTutor: filters.sexTutor.join(','),
        }).toString();
        history.pushState(null, '', `?${query}`);
        fetchCourses();
    }

     // Change page
     function changePage(page) {
        console.log(`Chuyển sang trang ${page}`);
        filters.page = page;
        applyFilters();
    }
    window.changePage = changePage;

    // Fetch courses
    function fetchCourses() {
       
        const query = new URLSearchParams({
            ...filters,
            subject: filters.subject.join(','),
            grade: filters.grade.join(','),
            teachingMode: filters.teachingMode.join(','),
            sexTutor: filters.sexTutor.join(','),
        }).toString();

        fetch(`/courses/filter?${query}`)
            .then((res) => res.json())
            .then((data) => {
                renderCourses(data.courses);
                renderPagination(data.currentPage, data.totalPages);
            });
    }

    // Render courses
    function renderCourses(courses) {
        courseList.innerHTML = '';
        courses.forEach((course) => {
            courseList.innerHTML += `
                            <div class="col-lg-4 col-md-6">
                    <div class="single-course">
                        <a href="/course/course-details/${course.slug}">
                            <!-- Nội dung bên trong thẻ này, nếu cần -->
                        </a>
                        <div class="course-details">
                            <a href="/course/course-details/${course.slug}">
                                <h6>${course.subject}</h6>
                            </a>
                            <div class="grade">
                                <h6>Cấp bậc: ${course.grade}</h6>
                            </div>
                            <div class="teachingMode">
                                <h6>Hình thức: ${course.teachingMode}</h6>
                            </div>
                            <div class="address">
                                <h6>Địa chỉ: ${course.address}</h6>
                            </div>
                            <div class="price">
                                <h6>Phí: ${course.fee} VND</h6>
                            </div>
                            <h6>Yêu cầu ${course.sexTutor} gia sư</h6>
                        </div>
                    </div>
                </div>
                `;
        });
    }

    // Render pagination
    function renderPagination(currentPage, totalPages) {
        paginationContainer.innerHTML = '';
        if (currentPage > 1) {
            paginationContainer.innerHTML += `<a href="#" onclick="changePage(${currentPage - 1})">Previous</a>`;
        }
        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += `<a href="#" onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        }
        if (currentPage < totalPages) {
            paginationContainer.innerHTML += `<a href="#" onclick="changePage(${currentPage + 1})">Next</a>`;
        }
    }

   

    // Handle search
    searchInput.addEventListener('input', () => {
        filters.keyword = searchInput.value;
        filters.page = 1;
        applyFilters();
    });

    // Handle filter checkbox change
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const filterName = checkbox.name;
            const isChecked = checkbox.checked;

            if (isChecked) {
                filters[filterName].push(checkbox.value);
            } else {
                filters[filterName] = filters[filterName].filter((val) => val !== checkbox.value);
            }

            filters.page = 1;
            applyFilters();
        });
    });

    // Initial fetch
    fetchCourses();
});
