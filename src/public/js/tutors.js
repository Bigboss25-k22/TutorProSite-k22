document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search_input');
    const searchButton = document.getElementById('search_button');
    const filterAddress = document.getElementById('filter_address');
    const filterSpecialization = document.getElementById('filter_specialization');
    const tutorList = document.getElementById('tutor-list');
    const paginationContainer = document.getElementById('pagination');

    // Lấy các tham số từ URL
    const urlParams = new URLSearchParams(window.location.search);
    let filters = {
        keyword: urlParams.get('keyword') || '',
        address: urlParams.get('address') || '',
        specialization: urlParams.get('specialization') || '',
        page: parseInt(urlParams.get('page')) || 1,
        limit: parseInt(urlParams.get('limit')) || 10,
    };

    // Set các giá trị ban đầu vào form
    searchInput.value = filters.keyword;
    filterAddress.value = filters.address;
    filterSpecialization.value = filters.specialization;

    // Hàm cập nhật URL
    function updateURL() {
        const query = new URLSearchParams(filters).toString();
        history.pushState(null, '', `?${query}`);
    }

    // Fetch gia sư từ server
    function fetchTutors() {
        const query = new URLSearchParams(filters).toString();
        fetch(`/tutors/filter?${query}`)
            .then((res) => res.json())
            .then((data) => {
                renderTutors(data.tutors);
                renderPagination(data.pagination);
            })
            .catch((error) => console.error('Error fetching tutors:', error));
    }

    // Hiển thị danh sách gia sư
    function renderTutors(tutors) {
        tutorList.innerHTML = '';
        if (tutors.length === 0) {
            tutorList.innerHTML = `<p>Không tìm thấy gia sư phù hợp.</p>`;
            return;
        }
        tutors.forEach((tutor) => {
            tutorList.innerHTML += `
                <div class="col-md-4">
                    <div class="tutor-card">
                        <h3>${tutor.name}</h3>
                        <p><strong>Địa chỉ:</strong> ${tutor.address}</p>
                        <p><strong>Chuyên ngành:</strong> ${tutor.specialization}</p>
                    </div>
                </div>
            `;
        });
    }

    // Hiển thị phân trang
    function renderPagination({ totalPages, currentPage }) {
        paginationContainer.innerHTML = '';

        if (currentPage > 1) {
            paginationContainer.innerHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += `
                <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>
            `;
        }

        if (currentPage < totalPages) {
            paginationContainer.innerHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
        }
    }

    // Chuyển trang
    window.changePage = (page) => {
        filters.page = page;
        updateURL();
        fetchTutors();
    };

    // Thêm debounce để tránh gọi API quá nhiều lần khi nhập từ khóa
    let debounceTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            filters.keyword = searchInput.value;
            filters.page = 1; // Reset về trang đầu
            updateURL();
            fetchTutors();
        }, 500); // Chờ 500ms sau khi ngừng gõ
    });

    // Nút tìm kiếm (nếu muốn dùng riêng)
    searchButton.addEventListener('click', () => {
        filters.keyword = searchInput.value;
        filters.page = 1; // Reset về trang đầu
        updateURL();
        fetchTutors();
    });

    // Sự kiện lọc
    filterAddress.addEventListener('change', () => {
        filters.address = filterAddress.value;
        filters.page = 1;
        updateURL();
        fetchTutors();
    });

    filterSpecialization.addEventListener('change', () => {
        filters.specialization = filterSpecialization.value;
        filters.page = 1;
        updateURL();
        fetchTutors();
    });

    // Gọi fetch ban đầu
    fetchTutors();
});
