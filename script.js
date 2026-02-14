document.addEventListener('DOMContentLoaded', () => {
    // --- UI ELEMENTS ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.getElementById('chat-suggestions');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalIcon = document.getElementById('modal-icon');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    // --- SUGGESTIONS LOGIC ---
    const suggestions = [
        { text: "Tư vấn chuyến đi THCS", icon: "fa-graduation-cap" },
        { text: "An toàn tại Củ Chi?", icon: "fa-shield-alt" },
        { text: "Ngân sách 200k đi đâu?", icon: "fa-wallet" },
        { text: "Cách điểm danh đoàn đông", icon: "fa-users-cog" },
        { text: "Địa điểm teambuilding", icon: "fa-fist-raised" }
    ];

    function initSuggestions() {
        if (!chatSuggestions) return;
        chatSuggestions.innerHTML = '';
        suggestions.forEach(s => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.innerHTML = `<i class="fas ${s.icon}"></i> ${s.text}`;
            chip.addEventListener('click', () => {
                if (chatInput) {
                    chatInput.value = s.text;
                    const event = new Event('submit', { cancelable: true });
                    chatForm.dispatchEvent(event);
                }
            });
            chatSuggestions.appendChild(chip);
        });
    }

    initSuggestions();

    // --- SPA NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    function showSection(sectionId) {
        sections.forEach(sec => {
            sec.classList.remove('active');
            sec.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    // Expose showSection globally for buttons
    window.showSection = showSection;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
            window.location.hash = sectionId;
        });
    });

    // Handle initial hash or default to home
    const initialHash = window.location.hash.substring(1) || 'home';
    showSection(initialHash);

    // --- LOCATION DETAIL LOGIC ---
    const locLinks = document.querySelectorAll('.loc-link');
    const detailContent = document.getElementById('detail-content');

    locLinks.forEach(link => {
        link.addEventListener('click', () => {
            const locKey = link.getAttribute('data-loc');
            const locData = locationsKB[locKey];
            const imgUrl = link.closest('.location-item').querySelector('img').src;

            if (locData && detailContent) {
                let formattedInfo = locData.deepInfo.replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/✅/g, '<span style="color: #10b981;">✅</span>')
                    .replace(/❌/g, '<span style="color: #ef4444;">❌</span>');

                let formattedDebate = locData.debate.replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/⚠️/g, '<span style="color: #f59e0b;">⚠️</span>');

                detailContent.innerHTML = `
                    <div class="location-detail-container">
                        <h2 style="text-align: center; margin-bottom: 30px;">${locData.name}</h2>
                        <img src="${imgUrl}" class="detail-img" alt="${locData.name}">
                        
                        <div class="detail-info-block">
                            <h4><i class="fas fa-info-circle"></i> Giới thiệu</h4>
                            <p>${locData.desc.replace(/\n/g, '<br>')}</p>
                        </div>

                        ${locData.eduValue ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-graduation-cap"></i> Giá trị giáo dục</h4>
                            <p>${locData.eduValue.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.activities ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-walking"></i> Hoạt động trải nghiệm</h4>
                            <p>${locData.activities.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.suitability ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-user-friends"></i> Phù hợp với</h4>
                            <p>${locData.suitability.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.schedule ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-calendar-alt"></i> Gợi ý lịch trình</h4>
                            <p>${locData.schedule.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.cost ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-ticket-alt"></i> Chi phí tham quan</h4>
                            <p>${locData.cost.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        <div class="detail-info-block">
                            <h4><i class="fas fa-clipboard-check"></i> Lưu ý an toàn & Tổ chức</h4>
                            <div>${formattedInfo}</div>
                        </div>

                        <div class="detail-info-block" style="border-left: 5px solid #f59e0b;">
                            <h4><i class="fas fa-lightbulb"></i> Góc nhìn từ chuyên gia STA</h4>
                            <div>${formattedDebate}</div>
                        </div>
                    </div>
                `;
                showSection('location-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // --- Data for Introduction Pop-ups (Index Page) ---
    const introData = {
        'Giới thiệu Web': {
            icon: 'fa-info-circle',
            content: `<strong>SchoolTrip AI (STA)</strong> là giải pháp công nghệ tiên phong, chuyên sâu về quản trị và tư vấn du lịch trường học. <br><br>
            Khác với các trang web du lịch thông thường, chúng tôi tập trung tối đa vào <strong>An toàn (Safety)</strong> và <strong>Giáo dục (Education)</strong>. Với hệ thống cơ sở dữ liệu khổng lồ về 13 vấn đề quản trị rủi ro và 12 địa điểm trải nghiệm tiêu chuẩn, STA giúp các chuyến đi của học sinh trở nên khoa học, an toàn và đầy cảm hứng.`
        },
        'Mục đích Web': {
            icon: 'fa-bullseye',
            content: `Mục tiêu cốt lõi của STA là xóa bỏ sự lo lắng của nhà trường và phụ huynh trong mỗi chuyến ngoại khóa.<br><br>
            Chúng tôi cung cấp bộ công cụ giúp:<br>
            • <strong>Chuẩn hóa quy trình:</strong> Từ khâu chuẩn bị, điểm danh đến xử lý sự cố.<br>
            • <strong>Cổng thông tin tập trung:</strong> Kết nối nhà trường - phụ huynh - đơn vị lữ hành.<br>
            • <strong>Cố vấn AI chuyên gia:</strong> Trả lời tức thì mọi tình huống rủi ro thực tế.`
        },
        'Hiệu quả mang lại': {
            icon: 'fa-chart-line',
            content: `Việc ứng dụng SchoolTrip AI mang lại những giá trị đo lường được:<br><br>
            • <strong>Giảm 90% rủi ro thất lạc:</strong> Nhờ quy trình điểm danh 3 lớp và công nghệ định danh.<br>
            • <strong>Tối ưu 70% thời gian lên kế hoạch:</strong> Với các mẫu lịch trình và lưu ý địa điểm có sẵn.<br>
            • <strong>Nâng cao 100% chỉ số tin tưởng:</strong> Phụ huynh hoàn toàn yên tâm khi biết con em được quản lý bởi hệ thống chuyên nghiệp.`
        },
        'Điểm nổi bật': {
            icon: 'fa-star',
            content: `Tại sao nên chọn SchoolTrip AI?<br><br>
            • <strong>Trợ lý STA thông minh:</strong> Nhận diện ý định ngay cả với từ khóa ngắn, tư vấn sâu sắc về "Nên" và "Không nên".<br>
            • <strong>Phân tích Phản biện:</strong> Duy nhất tại STA, chúng tôi đưa ra các rủi ro tiềm ẩn (Debate) giúp Ban tổ chức không chủ quan.<br>
            • <strong>Chuyên sâu giáo dục:</strong> Mỗi địa điểm đều được đánh giá dựa trên giá trị bài học thực tiễn cho học sinh.`
        },
        'Hướng dẫn': {
            icon: 'fa-book-open',
            content: `Khám phá STA qua 3 bước đơn giản:<br><br>
            • <strong>Bước 1:</strong> Truy cập <em>"Vấn đề thường gặp"</em> để nắm chắc 13 quy trình quản trị cốt lõi.<br>
            • <strong>Bước 2:</strong> Xem <em>"Địa điểm du lịch"</em> để chọn nơi đến phù hợp với lứa tuổi và mục tiêu giáo dục.<br>
            • <strong>Bước 3:</strong> Chat trực tiếp với <strong>STA Assistant</strong> để nhận tư vấn riêng biệt cho đoàn của bạn (Ví dụ: "Lưu ý an toàn cho 200 HS đi Củ Chi").`
        },
        'Đối tượng sử dụng': {
            icon: 'fa-user-graduate',
            content: `STA được thiết kế tối ưu cho:<br><br>
            • <strong>Ban Giám hiệu:</strong> Để phê duyệt các phương án tổ chức an toàn, đúng pháp lý.<br>
            • <strong>Giáo viên chủ nhiệm:</strong> Công cụ hỗ trợ quản lý lớp, điểm danh và chăm sóc HS.<br>
            • <strong>Phụ huynh:</strong> Kênh theo dõi lộ trình và yên tâm về sự chuẩn bị của nhà trường.<br>
            • <strong>Các đơn vị lữ hành:</strong> Nâng cấp chất lượng dịch vụ theo chuẩn giáo dục quốc tế.`
        }
    };

    // --- Modal Handling ---
    document.querySelectorAll('.intro-box').forEach(box => {
        box.addEventListener('click', () => {
            const h3 = box.querySelector('h3');
            if (!h3) return;
            const title = h3.innerText;
            const data = introData[title];
            if (data && modalOverlay) {
                modalTitle.innerText = title;
                modalIcon.className = `fas ${data.icon}`;
                modalBody.innerHTML = data.content;
                modalOverlay.classList.add('active');
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // --- 13 MANAGEMENT ISSUES KNOWLEDGE BASE (STA PHẢN BIỆN CHUYÊN SÂU) ---
    const issuesKB = {
        'quy mô': {
            title: 'QUY MÔ – KHÔNG GIAN – TỔ CHỨC ĐOÀN',
            rootCause: 'Thiếu sót trong khâu khảo sát thực địa (tiền trạm) và dự báo mật độ khách tại điểm đến theo thời điểm.',
            risks: 'Gây ùn tắc cục bộ, mất kiểm soát tầm nhìn, HS dễ bị kích động tâm lý đám đông dẫn đến va chạm vật lý.',
            solution: 'Thiết lập mô hình "Phễu điều phối": Chia đoàn thành các module 40 HS, di chuyển lệch pha 15 phút tại các điểm nút.',
            example: 'Đoàn 500 HS cùng tập trung tại sảnh Dinh Độc Lập gây nhiễu loạn thông tin thuyết minh và khó kiểm soát sĩ số.',
            tech: 'Sử dụng bản đồ số hóa phân luồng di chuyển và cảm biến mật độ (nếu điểm đến hỗ trợ).'
        },
        'thất lạc': {
            title: 'KIỂM SOÁT SĨ SỐ VÀ TRÁNH THẤT LẠC',
            rootCause: 'Hệ thống liên lạc lỏng lẻo giữa các nhóm và sự chủ quan của HS khi di chuyển trong không gian mở.',
            risks: 'HS đi lạc vào khu vực nguy hiểm, bị đối tượng xấu tiếp cận hoặc gây hoảng loạn cho phụ huynh và nhà trường.',
            solution: 'Áp dụng nguyên tắc "Buddy System" (Đôi bạn cùng tiến) + Điểm danh chéo giữa các trưởng nhóm mỗi khi chuyển vị trí.',
            example: 'Học sinh tự ý tách đoàn đi vệ sinh ngay sau khi vừa điểm danh tại xe, dẫn đến xe khởi hành thiếu người.',
            tech: 'Vòng tay định danh QR Code chứa thông tin khẩn cấp và GPS cho các nhóm trưởng.'
        },
        'điểm danh': {
            title: 'ĐIỂM DANH VÀ THEO DÕI HỌC SINH',
            rootCause: 'Phương pháp điểm danh truyền thống (gọi tên) tốn thời gian và dễ sai sót khi đoàn đang ồn ào.',
            risks: 'Bỏ sót học sinh đang gặp sự cố y tế hoặc đang bị kẹt lại tại các khu vực khuất tầm nhìn.',
            solution: 'Quy trình "Sĩ số 3 tầng": Trưởng nhóm báo số -> GV chủ nhiệm đối soát thẻ trực quan -> HDV tổng hợp hệ thống.',
            example: 'HDV vội vàng đếm đầu người trên xe mà không kiểm tra mặt từng HS, dẫn đến đếm nhầm khách vãng lai.',
            tech: 'Phần mềm SchoolTrip Check-in tự động cập nhật sĩ số theo thời gian thực về máy chủ nhà trường.'
        },
        'nhóm': {
            title: 'QUẢN LÝ HỌC SINH THEO NHÓM/LỚP',
            rootCause: 'Cấu trúc quản lý quá phẳng (1 GV quản quá nhiều HS) làm quá tải khả năng giám sát.',
            risks: 'Hình thành các nhóm tự phát khó kiểm soát kỷ luật và dễ xảy ra mâu thuẫn nội bộ đoàn.',
            solution: 'Phân quyền "Ma trận quản lý": Mỗi lớp chia 4 nhóm, mỗi nhóm có 1 nhóm trưởng đại diện liên lạc.',
            example: 'Nhóm học sinh cá biệt tự ý tách đoàn đi khu trò chơi cảm giác mạnh khi chưa được phép của giáo viên.',
            tech: 'Nhóm Zalo/Viber phân cấp để chỉ thị được truyền đạt tức thời đến từng cá nhân.'
        },
        'kỷ luật': {
            title: 'Ý THỨC VÀ KỶ LUẬT',
            rootCause: 'Nội quy chuyến đi chưa được phổ biến thực chất hoặc hình thức thưởng phạt không minh bạch.',
            risks: 'Làm hỏng hình ảnh nhà trường, gây hư hại di tích/vật dụng tại điểm đến, tạo tiền lệ xấu cho các chuyến đi sau.',
            solution: 'Xây dựng "Bộ quy tắc ứng xử Tour": Ký cam kết trước khi đi và áp dụng hình thức "Điểm tích lũy hành vi".',
            example: 'Học sinh viết vẽ bậy lên hiện vật tại di tích lịch sử do giáo viên không nhắc nhở ngay từ đầu.',
            tech: 'Hệ thống đánh giá hành vi trực tuyến để xếp hạng thi đua giữa các lớp sau chuyến đi.'
        },
        'sức khỏe': {
            title: 'AN TOÀN VÀ SỨC KHỎE',
            rootCause: 'Môi trường thay đổi đột ngột (nắng gắt, thức ăn lạ) và thiếu sự chuẩn bị về vật tư y tế khẩn cấp.',
            risks: 'Ngộ độc thực phẩm tập thể, say nắng, chấn thương trong hoạt động vận động mạnh.',
            solution: 'Thiết lập "Trạm y tế di động" luôn đi kèm đoàn và kiểm kê hồ sơ bệnh lý HS trước 1 tuần.',
            example: 'Học sinh bị dị ứng hải sản nhưng Ban tổ chức không kiểm tra danh sách thực đơn trước khi đặt ăn.',
            tech: 'Vòng tay y tế cảnh báo HS có bệnh nền (tim mạch, hen suyễn) để HDV đặc biệt lưu tâm.'
        },
        'tâm lý': {
            title: 'TÂM LÝ HỌC SINH',
            rootCause: 'Áp lực từ lịch trình quá dày hoặc sự cô lập trong môi trường nhóm mới.',
            risks: 'HS bị stress, hoảng loạn khi vào không gian hẹp (như địa đạo) hoặc xảy ra bắt nạt bạn bè.',
            solution: 'Bố trí "Góc tham vấn nhanh": GV chủ nhiệm đóng vai trò quan sát tâm trạng HS để can thiệp kịp thời.',
            example: 'Học sinh bị hội chứng sợ không gian hẹp khi xuống địa đạo Củ Chi dẫn đến ngất xỉu do quá lo sợ.',
            tech: 'Sử dụng các ứng dụng khảo sát tâm trạng nhanh sau mỗi chặng nghỉ để điều chỉnh hoạt động.'
        },
        'liên lạc': {
            title: 'LIÊN LẠC VÀ THÔNG TIN',
            rootCause: 'Nhiễu loạn thông tin giữa các bên (Trường - Công ty - Phụ huynh) do thiếu kênh chính thống.',
            risks: 'Tin đồn thất thiệt lan truyền khi có sự cố nhỏ, gây khủng hoảng truyền thông cho nhà trường.',
            solution: 'Xác lập "Luồng thông tin duy nhất": Một người phát ngôn duy nhất cập nhật tiến độ lên nhóm chung.',
            example: 'Phụ huynh lo lắng thái quá khi không gọi được cho con vì vùng mất sóng, trong khi đoàn vẫn an toàn.',
            tech: 'Tổng đài Hotline STA tự động trả lời các thông tin cơ bản về lịch trình đoàn.'
        },
        'nhân sự': {
            title: 'NHÂN SỰ QUẢN LÝ',
            rootCause: 'Tỷ lệ nhân sự/học sinh không đạt chuẩn hoặc HDV thiếu kỹ năng điều khiển học sinh.',
            risks: 'Nhân sự kiệt sức dẫn đến lơ là quan sát an toàn, hdv không xử lý được các tình huống nổi loạn.',
            solution: 'Đảm bảo tỷ lệ 1:12 cho tiểu học và 1:15 cho trung học. Tập huấn kỹ năng cứu hộ cơ bản cho toàn bộ ekip.',
            example: 'HDV trẻ tuổi bị học sinh THPT "ép" thay đổi lịch trình theo ý thích cá nhân mà không báo cáo trường.',
            tech: 'Hệ thống đánh giá KPI nhân sự điều hành tour dựa trên phản hồi của giáo viên theo thời gian thực.'
        },
        'lịch trình': {
            title: 'THỜI GIAN VÀ LỊCH TRÌNH',
            rootCause: 'Thiết kế lịch trình quá tham lam hoặc không tính đến độ trễ khi di chuyển đoàn đông.',
            risks: 'Học sinh kiệt sức vì di chuyển liên tục, lịch trình bị vỡ dẫn đến bỏ sót các điểm tham quan quan trọng.',
            solution: 'Nguyên tắc "Lịch trình thở": Luôn dành 15% quỹ thời gian làm thời gian dự phòng giữa các điểm.',
            example: 'Đoàn đến điểm tham quan trễ 1 tiếng dẫn đến việc học sinh phải tham quan dưới trời nắng gắt 12h trưa.',
            tech: 'Sử dụng AI tối ưu hóa lộ trình di chuyển dựa trên dữ liệu giao thông thực tế.'
        },
        'phối hợp': {
            title: 'PHỐI HỢP CÁC BÊN',
            rootCause: 'Rào cản về trách nhiệm giữa nhà trường và đơn vị lữ hành trong các điều khoản hợp đồng.',
            risks: 'Đẩy đưa trách nhiệm khi sự cố xảy ra, gây chậm trễ trong công tác cứu hộ hoặc bồi thường.',
            solution: 'Ký kết "Biên bản cam kết trách nhiệm 3 bên" rõ ràng về quyền lợi và nghĩa vụ tối thượng.',
            example: 'Nhà hàng cung cấp suất ăn kém lượng nhưng công ty du lịch và trường không thống nhất được phương án đổi trả.',
            tech: 'Sử dụng hợp đồng điện tử và hệ thống lưu trữ biên bản làm việc số hóa.'
        },
        'pháp lý': {
            title: 'QUY TRÌNH VÀ PHÁP LÝ',
            rootCause: 'Thiếu sự thống nhất trong quy trình phê duyệt nội bộ và sự đồng thuận bằng văn bản từ phía gia đình học sinh.',
            risks: 'Thiếu cơ sở xác nhận trách nhiệm khi có sự cố, gây khó khăn cho GV trong việc quản lý và phối hợp với phụ huynh.',
            solution: 'Thiết lập "Quy trình phê duyệt 5 bước": 1. Trình kế hoạch BGH -> 2. Thông báo phụ huynh -> 3. Thu phiếu đồng ý (cam kết) -> 4. Chốt danh sách bảo hiểm -> 5. Phân công nhiệm vụ GV.',
            example: 'Học sinh tham gia chuyến đi nhưng phụ huynh chưa ký xác nhận đồng ý, dẫn đến tranh chấp trách nhiệm khi HS tự ý tách đoàn.',
            tech: 'Sử dụng Google Forms hoặc App trường học để thu thập phiếu đồng ý và số hóa danh sách cam kết của phụ huynh.'
        },
        'cong nghe': {
            title: 'ỨNG DỤNG CÔNG NGHỆ',
            rootCause: 'Sợ thay đổi hoặc cho rằng công nghệ là tốn kém và không thực sự cần thiết.',
            risks: 'Lạc hậu trong quản trị rủi ro, không tận dụng được sức mạnh của dữ liệu để dự báo sự cố.',
            solution: 'Số hóa toàn bộ quy trình từ khâu đăng ký, điểm danh đến khảo sát sau chuyến đi.',
            example: 'Tìm kiếm học sinh thất lạc mất 2 tiếng bằng sức người, trong khi có thể định vị trong 2 phút bằng GPS.',
            tech: 'Nền tảng Cloud tập trung tất cả dữ liệu chuyến đi phục vụ cho công tác rút kinh nghiệm lâu dài.'
        }
    };

    // --- 12 TOURIST LOCATIONS KNOWLEDGE BASE (DEEP CONTENT) ---
    const locationsKB = {
        'văn miếu': {
            name: 'VĂN MIẾU – QUỐC TỬ GIÁM (HÀ NỘI)',
            desc: 'Văn Miếu – Quốc Tử Giám được xây dựng năm 1070 dưới triều Lý Thánh Tông. Đây là nơi thờ Khổng Tử và được xem là trường đại học đầu tiên của Việt Nam, biểu tượng cho truyền thống hiếu học và tôn sư trọng đạo.',
            eduValue: `• Tìm hiểu lịch sử giáo dục và hệ thống khoa cử thời phong kiến Việt Nam.\n• Khám phá 82 bia Tiến sĩ (được UNESCO công nhận là Di sản tư liệu thế giới).\n• Giáo dục tinh thần hiếu học và tôn trọng tri thức.\n• Liên hệ với các môn Lịch sử, Ngữ văn, Giáo dục công dân.`,
            activities: 'Học sinh tham quan các khu vực chính như Khuê Văn Các và Nhà Thái Học, nghe thuyết minh về quá trình hình thành Quốc Tử Giám và tham gia hoạt động nhóm tìm hiểu về khoa cử xưa.',
            suitability: '• Học sinh lớp 4–5\n• Học sinh THCS\n• Học sinh THPT',
            schedule: 'Xuất phát buổi sáng, tham quan trong khoảng 2–3 giờ, kết hợp hoạt động nhóm và tổng kết chương trình trước khi trở về trường.',
            cost: `• Người lớn: 70.000 VNĐ/người\n• Học sinh, sinh viên (có thẻ): 35.000 VNĐ/người\n• Trẻ em dưới 16 tuổi: Miễn phí\n*(Giá vé có thể điều chỉnh theo thông báo của BQL)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chia nhóm nhỏ (< 20 người) để nghe thuyết minh về lịch sử 82 tấm bia Tiến sĩ.\n• Mặc trang phục lịch sự, trang nghiêm.\n\n❌ **Không nên (Should Not):** \n• Tuyệt đối không xoa đầu rùa hoặc ngồi lên bia di tích.\n• Gây ồn ào tại khu vực Thái Học trang trọng.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Không gian ở đây thiên về tĩnh và cổ kính, không phù hợp cho trẻ mầm non hiếu động. Rủi ro lớn nhất là trơn trượt trên gạch cổ khi trời mưa/nồm.'
        },
        'dinh độc lập': {
            name: 'DINH ĐỘC LẬP (TP.HCM)',
            desc: 'Dinh Độc Lập, còn gọi là Hội trường Thống Nhất, nằm ở Quận 1, TP. Hồ Chí Minh. Đây là di tích lịch sử quan trọng ghi dấu sự kiện 30/4/1975 – kết thúc chiến tranh, thống nhất đất nước. Công trình kiến trúc gắn liền với thời kỳ lịch sử hiện đại của Việt Nam.',
            eduValue: `• Tìm hiểu lịch sử Việt Nam giai đoạn kháng chiến chống Mỹ và quá trình thống nhất đất nước.\n• Khám phá vai trò và sinh hoạt của chính quyền Sài Gòn trước 1975.\n• Học về kiến trúc thời hiện đại và không gian văn phòng chính trị của một thời đại.\n• Liên hệ với nội dung môn Lịch sử và Giáo dục công dân.`,
            activities: `• Tham quan các phòng chức năng, nơi làm việc và tiếp khách của các nguyên thủ.\n• Khám phá hầm chỉ huy, phòng họp nội các và nghe thuyết minh chi tiết.\n• Tổ chức hoạt động hỏi đáp dựa trên các sự kiện lịch sử đã diễn ra.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n*(Rất phù hợp với nội dung lịch sử thế kỷ 20 và giáo dục truyền thống)*',
            schedule: 'Buổi sáng: Xuất phát đến Dinh -> Tham quan (2–3 giờ) -> Hoạt động nhóm/Hỏi đáp -> Tổng kết, chụp ảnh kỷ niệm trước khi về trường.',
            cost: `• Vé tham quan toàn bộ (Dinh + Nhà trưng bày):\n  - Người lớn (18–59): 80.000 VNĐ\n  - Người cao tuổi & Sinh viên: 40.000 VNĐ\n  - Trẻ em (6–17): 20.000 VNĐ\n• Vé tham quan riêng lẻ:\n  - Người lớn: 40.000 VNĐ\n  - Người cao tuổi & Sinh viên: 20.000 VNĐ\n  - Trẻ em (6–17): 10.000 VNĐ\n*(Cập nhật chính xác từ 01/01/2026)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Tham quan hệ thống hầm chỉ huy kiên cố và các phòng khánh tiết nghệ thuật.\n• Sử dụng sơ đồ để không bị lạc giữa các hành lang giống nhau.\n\n❌ **Không nên (Should Not):** \n• Tự ý chạm vào hiện vật, rèm cửa hoặc các vật dụng nội thất quý báu.\n• Di chuyển mạnh gây ồn ào tại các khu vực trưng bày quốc tế.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Hệ thống hành lang và các lầu của Dinh có thiết kế đối xứng, HS rất dễ bị lạc nhóm nếu đi tách lẻ. Cần bố trí GV chốt chặn tại các điểm giao cầu thang.'
        },
        'củ chi': {
            name: 'ĐỊA ĐẠO CỦ CHI (TP.HCM)',
            desc: 'Địa đạo Củ Chi là hệ thống đường hầm dưới lòng đất nằm tại huyện Củ Chi, TP. Hồ Chí Minh. Công trình được xây dựng trong thời kỳ kháng chiến và trở thành biểu tượng tiêu biểu cho chiến tranh du kích của Việt Nam.',
            eduValue: `• Giúp học sinh hiểu rõ chiến tranh Việt Nam và chiến lược du kích.\n• Trải nghiệm mô hình sinh hoạt và chiến đấu dưới lòng đất.\n• Giáo dục tinh thần kiên cường, ý chí vượt khó.\n• Liên hệ trực tiếp với môn Lịch sử và Giáo dục công dân.`,
            activities: `• Tham quan hệ thống địa đạo được mở rộng cho khách tham quan.\n• Nghe thuyết minh về quá trình xây dựng, tìm hiểu hiện vật, bếp Hoàng Cầm, hầm chỉ huy.\n• Tham quan khu tái hiện “Vùng giải phóng” (mua vé riêng).`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            schedule: 'Xuất phát buổi sáng -> Tham quan và nghe thuyết minh (2–3 giờ) -> Hoạt động nhóm tìm hiểu lịch sử -> Tổng kết và trở về trường.',
            cost: `• Khách Việt Nam: 35.000 VNĐ/người\n• Học sinh, sinh viên (7–16 tuổi): 17.500 VNĐ (giảm 50% khi có thẻ)\n• Trẻ em dưới 7 tuổi: Miễn phí\n• Vé tham quan khu "Vùng giải phóng": ~65.000 VNĐ\n*(Mở cửa: 7:00 – 17:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Mặc đồ thể thao, giày bệt/giày vải bám tốt.\n• Trải nghiệm ăn khoai mì tại chỗ để hiểu về thời kỳ kháng chiến.\n\n❌ **Không nên (Should Not):** \n• Xuống lòng hầm nếu có bệnh tim mạch, huyết áp hoặc chứng sợ không gian hẹp.\n• Tách đoàn vào các khu vực rừng rậm chưa được phát quang.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Lòng địa đạo dù đã được mở rộng nhưng vẫn thiếu oxy khi đoàn đông cùng xuống. Nguy cơ "Pannic attack" (hoảng loạn) là hoàn toàn có thật với HS thành phố chưa quen không gian tối/hẹp.'
        },
        'huế': {
            name: 'QUẦN THỂ DI TÍCH CỐ ĐÔ HUẾ',
            desc: 'Cố đô Huế là quần thể di tích lịch sử – văn hóa từng là kinh đô của Việt Nam dưới triều Nguyễn (1802–1945). Nơi đây được UNESCO công nhận là Di sản Văn hoá Thế giới nhờ giá trị kiến trúc và lịch sử đặc biệt.',
            eduValue: `• Tìm hiểu triều Nguyễn và lịch sử Việt Nam thế kỷ XIX–XX.\n• Khám phá kiến trúc cung đình, nghi lễ hoàng gia.\n• Giáo dục ý thức bảo tồn di sản văn hóa dân tộc.\n• Phù hợp tích hợp với các môn Lịch sử, Ngữ văn, GDCD.`,
            activities: `• Tham quan Đại Nội Huế (Hoàng thành, Tử Cấm Thành, Điện Thái Hòa…).\n• Khám phá hệ thống lăng tẩm các vua triều Nguyễn (Minh Mạng, Tự Đức, Khải Định).\n• Nghe thuyết minh lịch sử và tìm hiểu văn hóa cung đình.\n• Chụp ảnh, làm bài thu hoạch sau chuyến đi.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Đại Nội: 200.000 VNĐ (Người lớn), 40.000 VNĐ (Trẻ em 7-12)\n• Các lăng vua: 150.000 VNĐ (Người lớn), 30.000 VNĐ (Trẻ em 7-12)\n• Vé combo (Đại Nội + 3 lăng): ~530.000 VNĐ (Người lớn), ~100.000 VNĐ (Trẻ em)\n*(Cập nhật 2025–2026, Trẻ em < 6 tuổi miễn phí)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Trang bị mũ nón, nước uống đầy đủ vì diện tích tham quan cực rộng.\n• Chọn 2-3 điểm tiêu biểu (Đại Nội, Lăng Khải Định) thay vì đi hết.\n\n❌ **Không nên (Should Not):** \n• Di chuyển đi bộ quá nhiều dưới nắng gắt dẫn đến say nắng.\n• Ăn uống tự phát tại các hàng quán không đảm bảo bên ngoài các lăng tẩm.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Thời tiết Huế nắng mưa thất thường. Diện tích di tích lớn hơn khả năng quản lý của 1 giáo viên phụ trách 1 lớp. Cần thuê thêm hướng dẫn viên bản địa đi kèm mỗi nhóm.'
        },
        'tre việt': {
            name: 'LÀNG DU LỊCH TRE VIỆT (ĐỒNG NAI)',
            desc: 'Làng Du Lịch Sinh Thái Tre Việt (Funland) nằm tại Nhơn Trạch, Đồng Nai. Đây là khu du lịch sinh thái sông nước kết hợp vui chơi – dã ngoại – vận động ngoài trời, rất phù hợp cho các chuyến tham quan trong ngày của học sinh.',
            eduValue: `• Tìm hiểu hệ sinh thái sông nước miền Đông Nam Bộ.\n• Rèn luyện kỹ năng vận động và làm việc nhóm thông qua teambuilding.\n• Tăng trải nghiệm thực tế, gắn kết tập thể lớp.\n• Phù hợp tích hợp giáo dục kỹ năng sống và ngoại khóa vận động.`,
            activities: `• Tắm hồ bơi, vui chơi khu nước chuyên biệt.\n• Chèo kayak, thuyền thúng, xe đạp nước trên sông.\n• Tham gia trò chơi dân gian, cầu khỉ, vận động ngoài trời.\n• Tổ chức picnic hoặc thưởng thức buffet theo gói đoàn.`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Vé cổng: ~50.000 VNĐ\n• Combo cuối tuần (Hồ bơi + Buffet): ~330.000 VNĐ\n• Combo đầy đủ (Gồm trò chơi nước): ~369.000 VNĐ\n• Gói trẻ em: ~165.000 VNĐ\n*(Cập nhật tham khảo 2025–2026)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Bắt buộc mặc áo phao 100% thời gian khi ở gần hoặc xuống hồ nước.\n• Tổ chức các trò chơi teambuilding vận động dân gian.\n\n❌ **Không nên (Should Not):** \n• Tự ý nhảy xuống bơi lội tại các khu vực không có cứu hộ túc trực.\n• Mang đồ ăn có vỏ sắc nhọn vào khu vực trò chơi dưới nước.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Môi trường nước ngọt có rủi ro đuối nước cực nhanh. Sự chủ quan của HS (cho rằng mình biết bơi) là nguy cơ lớn nhất tại đây.'
        },
        'cần giờ': {
            name: 'SINH THÁI CẦN GIỜ (TP.HCM)',
            desc: 'Cần Giờ là khu vực sinh thái nổi tiếng thuộc TP. Hồ Chí Minh, được biết đến với hệ sinh thái rừng ngập mặn rộng lớn, không khí trong lành và cảnh quan sông nước đặc trưng. Đây là điểm đến phù hợp cho các chuyến tham quan học tập, trải nghiệm thiên nhiên và dã ngoại trong ngày.',
            eduValue: `• Tìm hiểu hệ sinh thái rừng ngập mặn và đa dạng sinh học.\n• Nghiên cứu thực tế về môi trường, biến đổi khí hậu và bảo tồn thiên nhiên.\n• Giáo dục ý thức bảo vệ môi trường cho học sinh.\n• Phù hợp tích hợp với các môn Sinh học, Địa lý, Giáo dục công dân.`,
            activities: `• Tham quan rừng ngập mặn, đi canô, chèo xuồng trong rừng.\n• Tham quan khu bảo tồn động vật (Đảo Khỉ, khu bảo tồn cá sấu...).\n• Tổ chức hoạt động nhóm, dã ngoại ngoài trời gắn liền thiên nhiên.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Vé vào cổng: ~30.000 – 70.000 VNĐ/người.\n• Các dịch vụ canô, tham quan chuyên sâu: Tính phí riêng.\n*(Giờ mở cửa: 07:00 – 17:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Cất toàn bộ vật dụng cá nhân (mũ, kính, điện thoại) vào túi kéo khóa khi vào Đảo Khỉ.\n• Dùng kem chống muỗi và mặc quần áo dài.\n\n❌ **Không nên (Should Not):** \n• Trêu chọc hoặc ném thức ăn về phía khỉ (chúng sẽ tấn công cướp đồ).\n• Xuống các khu vực đầm lầy trơn trượt không có chỉ dẫn.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Khỉ tại đây rất dạn người và hung dữ. Vết cắn của khỉ có thể gây nhiễm trùng nghiêm trọng. Cần giám sát tuyệt đối trẻ nhỏ.'
        },
        'ba vì': {
            name: 'VƯỜN QUỐC GIA BA VÌ (HÀ NỘI)',
            desc: 'Vườn Quốc gia Ba Vì nằm cách trung tâm Hà Nội khoảng 50–60 km về phía tây, với diện tích hơn 10.800 ha. Đây là khu bảo tồn thiên nhiên nổi tiếng với rừng nguyên sinh, khí hậu mát mẻ và hệ động – thực vật phong phú, rất phù hợp cho hoạt động học tập ngoài trời.',
            eduValue: `• Khám phá hệ sinh thái rừng tự nhiên và đa dạng sinh học.\n• Tìm hiểu địa hình miền núi và khí hậu vùng cao phía Bắc.\n• Giáo dục ý thức bảo vệ môi trường.\n• Phù hợp tích hợp với các môn Sinh học, Địa lý.`,
            activities: `• Trekking nhẹ theo các tuyến đường mòn trong rừng.\n• Tham quan đỉnh Vua, đền thờ trên núi Ba Vì.\n• Quan sát thực vật, chụp ảnh học tập thực tế.\n• Tổ chức hoạt động nhóm ngoài trời.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Người lớn: ~60.000 VNĐ\n• HS THCS: ~20.000 VNĐ (có thẻ)\n• HS THPT/Sinh viên: ~10.000 VNĐ (có thẻ)\n*(Giờ mở cửa: 06:00 – 18:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị áo khoác nhẹ vì nhiệt độ trên núi thường thấp hơn đồng bằng.\n• Khám phá nhà kính xương rồng và di tích nhà thờ đổ Pháp cổ.\n\n❌ **Không nên (Should Not):** \n• Leo trèo lên các vách đá hoặc di tích đổ nát không an toàn.\n• Đốt lửa trại tại các khu vực có thực vật rậm rạp.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Đường lên núi có nhiều khúc cua gấp, xe lớn rất khó di chuyển. Rủi ro lớn nhất là HS bị lạc trong rừng sâu nếu mải mê chụp ảnh tách nhóm.'
        },
        'thảo cầm viên': {
            name: 'THẢO CẦM VIÊN SÀI GÒN',
            desc: 'Thảo Cầm Viên Sài Gòn là vườn thú và vườn bách thảo lâu đời nhất Việt Nam, nằm tại Quận 1, TP.HCM. Đây là địa điểm tham quan – học tập ngoài trời kết hợp giữa bảo tồn động vật và không gian cây xanh rộng lớn ngay giữa trung tâm thành phố.',
            eduValue: `• Tìm hiểu đa dạng sinh học và môi trường sống của nhiều loài động vật.\n• Quan sát thực tế các loài thú, chim, bò sát.\n• Giáo dục ý thức bảo vệ động vật và môi trường.\n• Phù hợp tích hợp với các môn Sinh học, Khoa học tự nhiên.`,
            activities: `• Tham quan khu chuồng thú và khu bò sát.\n• Quan sát, ghi chép thông tin về các loài động vật.\n• Tổ chức hoạt động nhóm, học tập ngoài trời.\n• Tham gia các trò chơi trong khuôn viên (tùy nhu cầu).`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Trẻ em dưới 1m (đi cùng người lớn): Miễn phí\n• Khách cao từ 1m đến dưới 1.3m: 40.000 VNĐ/người\n• Khách cao từ 1.3m trở lên: 60.000 VNĐ/người`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chia nhóm nhỏ để quan sát tập tính của động vật.\n• Dùng bản đồ giấy để HS tập kỹ năng định hướng không gian.\n\n❌ **Không nên (Should Not):** \n• Ném thức ăn lạ vào chuồng thú hoặc trèo qua rào chắn an toàn.\n• Tiếp xúc gần với người lạ vãng lai trong khuôn viên.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Là khu vực mở ngay trung tâm nên có nhiều đối tượng lạ. Nguy cơ "người lạ dụ dỗ" (Stranger Danger) cao hơn so với các khu du lịch khép kín.'
        },
        'suối tiên': {
            name: 'KHU DU LỊCH VĂN HÓA SUỐI TIÊN',
            desc: 'Khu Du Lịch Văn Hóa Suối Tiên là tổ hợp vui chơi – giải trí kết hợp yếu tố văn hóa, tâm linh và lịch sử, nằm tại TP. Thủ Đức, TP.HCM. Đây là địa điểm tham quan nổi bật với các công trình mô phỏng truyền thuyết Việt Nam và nhiều trò chơi giải trí hiện đại.',
            eduValue: `• Tìm hiểu truyền thuyết và văn hóa dân gian Việt Nam (Sơn Tinh – Thủy Tinh, Lạc Long Quân – Âu Cơ…).\n• Kết hợp giáo dục lịch sử – văn hóa với hoạt động trải nghiệm thực tế.\n• Rèn luyện kỹ năng sinh hoạt tập thể, hoạt động nhóm.`,
            activities: `• Tham quan các khu chủ đề văn hóa – lịch sử (Đại Cung Lạc Long Quân - Âu Cơ...).\n• Vui chơi trò chơi cảm giác mạnh, trò chơi gia đình.\n• Tham quan biển Tiên Đồng – Ngọc Nữ (tắm biển nhân tạo).\n• Tổ chức hoạt động ngoại khóa, sinh hoạt tập thể.`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Người lớn: ~120.000 – 150.000 VNĐ\n• Trẻ em: ~60.000 – 100.000 VNĐ\n*(Giá vé trò chơi tính riêng, giờ mở cửa: 08:00 – 17:00)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chọn các vị trí tập trung dễ tìm (Cổng Tiên Đồng, Cổng ngõ 1).\n• Đảm bảo HS nắm rõ vị trí trạm y tế của khu du lịch.\n\n❌ **Không nên (Should Not):** \n• Cho HS chơi các trò cảm giác mạnh nếu chưa đạt tiêu chuẩn về chiều cao/sức khỏe.\n• Để HS tiểu học tự do đi lại tại các khu vực hồ nước sâu.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Mật độ khách tập trung tại đây vào cuối tuần rất cao. Rủi ro lạc sĩ số là thường xuyên xảy ra nếu không có hệ thống điểm danh 30 phút một lần.'
        },
        'đầm sen': {
            name: 'CÔNG VIÊN VĂN HÓA ĐẦM SEN',
            desc: 'Công viên Văn hóa Đầm Sen là khu vui chơi – giải trí lớn tại Quận 11, TP. Hồ Chí Minh với nhiều trò chơi hiện đại, khu cảnh quan sinh thái và không gian ngoài trời phù hợp cho hoạt động ngoại khóa, vui chơi cuối tuần hoặc tham quan học tập.',
            eduValue: `• Khám phá các trò chơi vận động và hoạt động nhóm ngoài trời.\n• Tìm hiểu về văn hoá giải trí hiện đại và quản lý công viên.\n• Rèn luyện kỹ năng phối hợp trong các trò chơi tập thể.`,
            activities: `• Tham quan, vui chơi các trò chơi cảm giác mạnh và trò chơi gia đình.\n• Dạo quanh cảnh quan hồ nước và các khu vực biểu diễn nghệ thuật.\n• Tổ chức hoạt động vui chơi nhóm, picnic dã ngoại ngoài trời.`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Vé cổng: ~120.000 VNĐ (Lớn), ~80.000 VNĐ (Trẻ em)\n• Gói tiêu chuẩn: ~260.000 VNĐ (Lớn), ~180.000 VNĐ (Trẻ em)\n• Gói Silver: ~380.000 VNĐ (Lớn), ~240.000 VNĐ (Trẻ em)\n*(Giờ mở cửa: 08:00 – 18:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Kiểm soát kỹ lối ngăn cách giữa Đầm Sen Khô và Đầm Sen Nước.\n• Tổ chức ăn tập trung tại nhà hàng uy tín bên trong khuôn viên.\n\n❌ **Không nên (Should Not):** \n• Tự ý sử dụng các trò chơi cảm giác mạnh mà không có sự đồng ý của GV.\n• Để HS mang quá nhiều tiền mặt hoặc đồ trang sức khi chơi công viên nước.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Hạ tầng một số trò chơi cũ cần được GV khảo sát trước. Rủi ro hỏng hóc thiết bị đột ngột là điều cần đề phòng.'
        },
        'suối mơ': {
            name: 'CÔNG VIÊN SUỐI MƠ (ĐỒNG NAI)',
            desc: 'Công viên Suối Mơ là khu du lịch sinh thái nằm tại huyện Tân Phú, tỉnh Đồng Nai, cách TP. Hồ Chí Minh khoảng 100 km. Với không gian thiên nhiên trong lành, sông nước, hồ rộng và rừng xanh bao quanh, đây là điểm vui chơi – dã ngoại – tham quan lý tưởng cho học sinh và gia đình.',
            eduValue: `• Hiểu về hệ sinh thái sông – rừng và cảnh quan thiên nhiên.\n• Rèn luyện kỹ năng sinh hoạt ngoài trời, teamwork.\n• Thích hợp liên hệ kiến thức Sinh học và Địa lý.`,
            activities: `• Tắm suối, bơi trong hồ nước trong xanh.\n• Tham gia trò chơi dưới nước và các hoạt động chèo thuyền, SUP.\n• Chụp ảnh, picnic, tổ chức nhóm ngoài trời.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Người lớn: ~120.000 VNĐ/người\n• Trẻ em (1m – 1,4m): ~60.000 VNĐ/người\n• Trẻ em dưới 1m: Miễn phí\n*(Lễ/Tết: Người lớn ~140k, Trẻ em ~70k. Giờ mở cửa: 07:00 – 18:00)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị đồ bơi và trang phục dự phòng sạch sẽ.\n• Luôn mặc áo phao khi tham gia các trò chơi mặt nước sâu.\n• Mang theo thuốc chống côn trùng vì khu vực có nhiều cây cối.\n\n❌ **Không nên (Should Not):** \n• Tự ý leo trèo lên các vách đá trơn trượt quanh khu hồ nước.\n• Xả rác hoặc đồ ăn thừa xuống dòng suối tự nhiên.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Nước suối ở đây chảy tự nhiên nên độ sâu không đồng đều, có nhiều đá ngầm phía dưới. Nguy cơ trượt chân hoặc va đập vào đá khi đùa nghịch dưới nước là rất cao.'
        },
        'đại nam': {
            name: 'KHU DU LỊCH ĐẠI NAM (BÌNH DƯƠNG)',
            desc: 'Khu du lịch Đại Nam là quần thể du lịch – giải trí – tâm linh lớn tại TP. Thủ Dầu Một, tỉnh Bình Dương, với diện tích rộng, bao gồm đền chùa, vườn thú, bãi biển nhân tạo, khu trò chơi cảm giác mạnh, khu trình diễn và nhiều hoạt động ngoài trời. Đây là điểm đến phù hợp cho chuyến tham quan học tập kết hợp vui chơi, dã ngoại.',
            eduValue: `• Hiểu về kiến trúc văn hoá – tâm linh trong các khu đền chùa.\n• Quan sát hệ sinh thái động vật tại vườn thú.\n• Rèn kỹ năng quan sát, phản xạ và khám phá trong trò chơi ngoài trời.\n• Phù hợp tích hợp với các môn Lịch sử, Văn hoá, Giáo dục thể chất.`,
            activities: `• Tham quan vườn thú và khu sinh thái.\n• Trải nghiệm các trò chơi nhẹ đến cảm giác mạnh.\n• Nghỉ ngơi, dã ngoại ngoài trời.\n• Tham quan khu tâm linh, đền đài và các chương trình trình diễn.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n*(Có thể kết hợp tham quan – nghiên cứu – vui chơi trong ngày)*',
            cost: `• Vé vườn thú: 100.000 VNĐ (Người lớn), 50.000 VNĐ (Trẻ em)\n• Biển nhân tạo: 150.000 VNĐ (Người lớn), 50.000 VNĐ (Trẻ em)\n• Combo trò chơi: 120k (3 trò), 200k (6 trò), 400k (12 trò)\n*(Dưới 1m miễn phí. Giờ mở cửa: 08:00 – 17:00/18:00)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Thuê xe điện cho đoàn di chuyển để bảo vệ sức khỏe học sinh.\n• Tham quan Kim Điện với thái độ trang nghiêm, yên lặng.\n\n❌ **Không nên (Should Not):** \n• Đi bộ xuyên suốt các khu vì diện tích hàng trăm héc-ta sẽ gây kiệt sức.\n• Để HS tự ý xuống tắm tại biển nhân tạo mà không có sự báo cáo GV.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Diện tích quá lớn khiến GV không thể bao quát 100% học sinh bằng mắt thường. Cần hệ thống liên lạc bộ đàm cho các nhóm trưởng.'
        }
    };

    // --- KEYWORD MAPPER (Handling 1-3 word queries) ---
    const keywordMapper = {
        // 1. QUY MÔ - KHÔNG GIAN
        'quy mô': 'quy mô', 'không gian': 'quy mô', 'tổ chức đoàn': 'quy mô', 'đông': 'quy mô', 'số lượng': 'quy mô', 'diện tích': 'quy mô', 'chỗ': 'quy mô', 'sức chứa': 'quy mô', 'mật độ': 'quy mô', 'ùn tắc': 'quy mô', 'lộn xộn': 'quy mô', 'quá đông': 'quy mô',

        // 2 & 3 & 4. QUẢN LÝ HỌC SINH (Gộp linh hoạt theo yêu cầu)
        'quản lý học sinh': 'nhóm', 'quản lí học sinh': 'nhóm', 'quản lý theo nhóm': 'nhóm', 'chia nhóm': 'nhóm', 'quản lý đoàn': 'nhóm', 'kiểm soát học sinh': 'nhóm', 'theo dõi học sinh': 'nhóm', 'quản lý danh sách': 'nhóm', 'điểm danh': 'nhóm', 'sĩ số': 'nhóm', 'kiểm diện': 'nhóm', 'đếm người': 'nhóm', 'thất lạc': 'nhóm', 'bị lạc': 'nhóm', 'mất học sinh': 'nhóm', 'tách đoàn': 'nhóm', 'đi lẻ': 'nhóm', 'tìm học sinh': 'nhóm', 'quản lý thành viên': 'nhóm', 'theo dõi đoàn': 'nhóm', 'quản lý lớp': 'nhóm',

        // 5. KỶ LUẬT
        'ý thức': 'kỷ luật', 'kỷ luật': 'kỷ luật', 'nội quy': 'kỷ luật', 'phạt': 'kỷ luật', 'thưởng': 'kỷ luật', 'hành vi': 'kỷ luật', 'quậy phá': 'kỷ luật', 'nghịch': 'kỷ luật', 'đánh nhau': 'kỷ luật', 'vi phạm': 'kỷ luật', 'tuân thủ': 'kỷ luật', 'quy tắc': 'kỷ luật',

        // 6. SỨC KHỎE
        'an toàn': 'sức khỏe', 'sức khỏe': 'sức khỏe', 'y tế': 'sức khỏe', 'ốm': 'sức khỏe', 'đau': 'sức khỏe', 'tai nạn': 'sức khỏe', 'rủi ro': 'sức khỏe', 'thuốc': 'sức khỏe', 'ngộ độc': 'sức khỏe', 'dị ứng': 'sức khỏe', 'bị thương': 'sức khỏe', 'cấp cứu': 'sức khỏe', 'say nắng': 'sức khỏe', 'sơ cứu': 'sức khỏe',

        // 7. TÂM LÝ
        'tâm lý': 'tâm lý', 'cảm xúc': 'tâm lý', 'hoảng sợ': 'tâm lý', 'lo lắng': 'tâm lý', 'bắt nạt': 'tâm lý', 'stress': 'tâm lý', 'nhút nhát': 'tâm lý', 'sợ hãi': 'tâm lý', 'tinh thần': 'tâm lý', 'trầm cảm': 'tâm lý', 'vui vẻ': 'tâm lý',

        // 8. LIÊN LẠC
        'liên lạc': 'liên lạc', 'thông tin': 'liên lạc', 'zalo': 'liên lạc', 'phụ huynh': 'liên lạc', 'hotline': 'liên lạc', 'số điện thoại': 'liên lạc', 'báo cáo': 'liên lạc', 'cập nhật': 'liên lạc', 'kết nối': 'liên lạc', 'thông báo': 'liên lạc',

        // 9. NHÂN SỰ
        'nhân sự': 'nhân sự', 'giáo viên': 'nhân sự', 'hdv': 'nhân sự', 'điều hành': 'nhân sự', 'người quản lý': 'nhân sự', 'thầy cô': 'nhân sự', 'hướng dẫn viên': 'nhân sự', 'phân công': 'nhân sự', 'trách nhiệm': 'nhân sự',

        // 10. LỊCH TRÌNH
        'thời gian': 'lịch trình', 'lịch trình': 'lịch trình', 'giờ giấc': 'lịch trình', 'đi đâu': 'lịch trình', 'kế hoạch': 'lịch trình', 'trễ giờ': 'lịch trình', 'chậm': 'lịch trình', 'lộ trình': 'lịch trình', 'chương trình': 'lịch trình',

        // 11. PHỐI HỢP
        'phối hợp': 'phối hợp', 'nhà trường': 'phối hợp', 'công ty': 'phối hợp', 'đối tác': 'phối hợp', 'hợp đồng': 'phối hợp', 'cam kết': 'phối hợp', 'thống nhất': 'phối hợp', 'trao đổi': 'phối hợp',

        // 12. PHÁP LÝ
        'quy trình': 'pháp lý', 'pháp lý': 'pháp lý', 'luật': 'pháp lý', 'bảo hiểm': 'pháp lý', 'xin phép': 'pháp lý', 'bgh': 'pháp lý', 'hiệu trưởng': 'pháp lý', 'phiếu đồng ý': 'pháp lý', 'giấy tờ': 'pháp lý', 'thủ tục': 'pháp lý',

        // 13. CÔNG NGHỆ
        'công nghệ': 'cong nghe', 'app': 'cong nghe', 'phần mềm': 'cong nghe', 'qr': 'cong nghe', 'gps': 'cong nghe', 'định vị': 'cong nghe', 'số hóa': 'cong nghe', 'điện tử': 'cong nghe'
    };

    // --- AI LOGIC FUNCTIONS ---
    function appendMessage(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender} animate-fade`;

        // Optimize line breaks (handle double newlines for significant spacing)
        let formattedText = text.replace(/\n\n\n+/g, '<br><div style="margin-bottom: 25px;"></div>')
            .replace(/\n\n/g, '<br><div style="margin-bottom: 18px;"></div>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/📌/g, '<span style="color: #4f46e5;">📌</span>')
            .replace(/✅/g, '<span style="color: #10b981;">✅</span>')
            .replace(/❌/g, '<span style="color: #ef4444;">❌</span>')
            .replace(/⚠️/g, '<span style="color: #f59e0b;">⚠️</span>')
            .replace(/🔎/g, '<span style="color: #06b6d4;">🔎</span>')
            .replace(/📍/g, '<span style="color: #f59e0b;">📍</span>')
            .replace(/💡/g, '<span style="color: #fbbf24;">💡</span>')
            .replace(/✨/g, '<span style="color: #a855f7;">✨</span>')
            .replace(/🤖/g, '<span style="color: #3b82f6;">🤖</span>')
            .replace(/🌈/g, '<span style="color: #f43f5e;">🌈</span>');

        chatMessages.appendChild(msgDiv);

        if (sender === 'ai') {
            msgDiv.innerHTML = "";
            let i = 0;
            // Target 5 seconds (5000ms) for total message
            // Min speed 2ms, max speed 20ms
            const dynamicSpeed = Math.max(2, Math.min(20, Math.floor(5000 / formattedText.length)));

            function typeWriter() {
                if (i < formattedText.length) {
                    if (formattedText.charAt(i) === '<') {
                        const tagEnd = formattedText.indexOf('>', i);
                        if (tagEnd !== -1) {
                            msgDiv.innerHTML += formattedText.substring(i, tagEnd + 1);
                            i = tagEnd + 1;
                        } else {
                            msgDiv.innerHTML += formattedText.charAt(i);
                            i++;
                        }
                    } else {
                        msgDiv.innerHTML += formattedText.charAt(i);
                        i++;
                    }
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(typeWriter, dynamicSpeed);
                }
            }
            typeWriter();
        } else {
            msgDiv.innerHTML = formattedText;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function getAIResponse(input) {
        const query = input.toLowerCase();

        // --- 1. GREETING CASE ---
        if (query.includes('chào') || query.includes('hello') || query === 'hi') {
            return "🤖 **CHUYÊN GIA TƯ VẤN DU LỊCH TRƯỜNG HỌC (STA)**\n\nChào bạn! Tôi là **STA**, trợ lý AI chuyên về quản trị rủi ro và điều hành tour học sinh.\n\nBạn có thể thử hỏi tôi:\n📍 **Địa điểm:** \"Tư vấn chuyến đi THCS\", \"An toàn tại Củ Chi?\"...\n🛡️ **Quản lý:** \"Cách điểm danh đoàn đông\", \"Xử lý y tế\"...\n💰 **Ngân sách:** \"Ngân sách 200k đi đâu?\"\n\n💬 **Mời bạn chia sẻ nhu cầu để tôi phân tích chuyên sâu.**";
        }

        // --- 2. SCOPE & IRRELEVANCE CHECK ---
        const irrelevantKeywords = ['quốc tế', 'bài tập', 'tài chính cá nhân', 'đầu tư', 'viết văn', 'giải toán'];
        if (irrelevantKeywords.some(k => query.includes(k))) {
            return "STA chuyên sâu về **Du lịch trường học nội địa**. Rất tiếc tôi không thể hỗ trợ các chủ đề nằm ngoài phạm vi chuyên môn này.";
        }

        // --- 3. EXPERT RESPONSE LOGIC ---
        // A. Tư vấn chuyến đi THCS
        if (query.includes('tư vấn') && (query.includes('thcs') || query.includes('cấp 2'))) {
            return `📊 **TƯ VẤN CHUYẾN ĐI KHỐI THCS (CẤP 2):**\n\n` +
                `📍 **Đề xuất 1: Địa đạo Củ Chi / Dinh Độc Lập**\n• **Chi phí:** Thấp (~20k-40k vé). \n• **An toàn:** Cao. \n• **Trải nghiệm:** Giáo dục lòng yêu nước, thực địa lịch sử.\n\n` +
                `📍 **Đề xuất 2: Suối Mơ / Tre Việt**\n• **Chi phí:** Trung bình (~120k-200k combo). \n• **An toàn:** Cần giám sát nước. \n• **Trải nghiệm:** Teambuilding, dã ngoại.\n\n` +
                `📍 **Đề xuất 3: Ba Vì / Cần Giờ**\n• **Chi phí:** Trung bình. \n• **An toàn:** Cảnh báo rủi ro ngoại cảnh. \n• **Trải nghiệm:** Nghiên cứu Sinh học, Địa lý.`;
        }

        // B. An toàn tại [địa điểm]
        let matchedSafetyLoc = null;
        for (let key in locationsKB) {
            if (query.includes(key) && (query.includes('an toàn') || query.includes('rủi ro'))) {
                matchedSafetyLoc = locationsKB[key];
                break;
            }
        }
        if (matchedSafetyLoc) {
            let scale = "Cao";
            if (matchedSafetyLoc.name.includes("SUỐI MƠ") || matchedSafetyLoc.name.includes("TRE VIỆT")) scale = "Trung bình";
            return `🛡️ **PHÂN TÍCH AN TOÀN TẠI ${matchedSafetyLoc.name}:**\n\n` +
                `🔍 **Rủi ro:** ${matchedSafetyLoc.debate}\n\n` +
                `💡 **Khuyến nghị:** ${matchedSafetyLoc.deepInfo.split('❌')[0].trim()}\n\n` +
                `📊 **Đánh giá:** **${scale}**`;
        }

        // C. Ngân sách [số tiền] đi đâu?
        if (query.includes('ngân sách') || (query.includes('đi đâu') && query.match(/\d+/))) {
            const numbers = query.match(/\d+(\.\d+)?/g);
            let rawBudget = numbers ? parseFloat(numbers[0]) : 0;
            let budgetInK = rawBudget;

            // Normalize units
            if (query.includes('triệu') || query.includes('tr')) {
                budgetInK = rawBudget * 1000;
            } else if (rawBudget >= 1000) {
                budgetInK = rawBudget / 1000; // Case like 200.000 -> 200k
            }

            let suggestion = "Với ngân sách này, bạn có thể cân nhắc các điểm lịch sử nội đô như **Văn Miếu** hoặc **Dinh Độc Lập**.";
            if (budgetInK >= 150) suggestion = "Ngân sách khá tốt, nên chọn **Suối Mơ**, **Tre Việt** hoặc **Đầm Sen**.";
            if (budgetInK >= 500) suggestion = "Ngân sách cao, có thể tổ chức tour liên tỉnh như **Cố đô Huế** hoặc tổ chức sự kiện lớn tại **Đại Nam**.";

            return `💰 **TƯ VẤN NGÂN SÁCH (~${budgetInK >= 1000 ? (budgetInK / 1000).toFixed(1) + ' triệu' : budgetInK + 'k'}):**\n\n` +
                `🧭 **Ghi chú:** ${suggestion}\n\n` +
                `📝 **Bao gồm:** Vé cổng, Bảo hiểm, Phí quản lý cơ bản.\n\n*Lưu ý: Ngân sách chưa bao gồm xe di chuyển và ăn trưa.*`;
        }

        // D. Cách điểm danh đoàn đông
        if (query.includes('điểm danh') || query.includes('đông')) {
            return `📋 **QUY TRÌNH ĐIỂM DANH CHUYÊN NGHIỆP:**\n\n` +
                `🚀 **Giải pháp:** Sử dụng **QR Code** vòng tay và quản lý theo nhóm Buddy.\n\n` +
                `🔢 **Các bước:**\n1. Điểm danh cố định tại xe.\n2. Chia luồng soát vé tại cổng.\n3. Điểm danh đột xuất mỗi 60 phút tại trạm tập kết.\n\n` +
                `💡 **Mẹo:** Badge màu theo khối để nhận diện từ xa.`;
        }

        // E. Tư vấn hoạt động Team building
        if (query.includes('teambuilding') || query.includes('hoạt động nhóm')) {
            return `🚩 **TƯ VẤN HOẠT ĐỘNG TEAM BUILDING (HỌC SINH):**\n\n` +
                `Dựa trên tiêu chí an toàn và ngân sách tiết kiệm, STA đề xuất các hoạt động giáo dục sau:\n\n` +
                `🏠 **HOẠT ĐỘNG TRONG NHÀ (INDOOR):**\n` +
                `1. **Tháp ống hút:** Xây tháp bằng vật liệu nhẹ. \n• **Mục tiêu:** Kỹ năng sáng tạo & Teamwork. \n• **An toàn:** Tuyệt đối.\n2. **Kịch bản gỡ rối:** Xử lý tình huống giả định. \n• **Mục tiêu:** Kỹ năng giao tiếp & Lãnh đạo.\n\n` +
                `🌳 **HOẠT ĐỘNG NGOÀI TRỜI (OUTDOOR):**\n` +
                `3. **Vòng xoáy kết nối:** Giải mã nút thắt tay. \n• **Mục tiêu:** Kỹ năng phối hợp tập thể. \n• **An toàn:** Rất cao.\n4. **Vượt bãi mìn:** Dẫn đường cho thành viên bịt mắt. \n• **Mục tiêu:** Xây dựng niềm tin & Lãnh đạo.\n5. **Tiếp sức đồng đội (với bóng):** Di chuyển bóng bằng lưng/trán. \n• **Mục tiêu:** Gắn kết thể chất & Sự kiên nhẫn.\n\n` +
                `📍 **Địa điểm phù hợp (Sân bãi tốt):** **Đại Nam**, **Tre Việt**, **Suối Mơ** hoặc **Đầm Sen**.\n\n` +
                `⚖️ **Nguyên tắc an toàn:** Không tổ chức các trò chơi va chạm mạnh hoặc dưới nước sâu mà thiếu cứu hộ chuyên nghiệp.`;
        }

        // --- 4. SECONDARY DATA HANDLING ---
        let matchedLocation = null;
        for (let key in locationsKB) {
            if (query.includes(key)) {
                matchedLocation = locationsKB[key];
                break;
            }
        }
        if (matchedLocation) {
            return `📊 **HỖ TRỢ RA QUYẾT ĐỊNH: ${matchedLocation.name}**\n\n` +
                `🔹 **Phân tích:** ${matchedLocation.suitability}\n\n` +
                `🎓 **Giá trị giáo dục:** ${matchedLocation.eduValue}\n\n` +
                `💰 **Chi phí:** ${matchedLocation.cost}\n\n` +
                `🛡️ **An toàn:** ${matchedLocation.debate}`;
        }

        let matchedIssueKeys = Object.keys(keywordMapper).filter(kw => query.includes(kw)).map(kw => keywordMapper[kw]);
        matchedIssueKeys = [...new Set(matchedIssueKeys)];
        if (matchedIssueKeys.length > 0) {
            let res = `🛠️ **BÁO CÁO PHÂN TÍCH QUẢN TRỊ CHUYÊN SÂU (STA):**\n\n`;
            matchedIssueKeys.forEach(k => {
                const issue = issuesKB[k];
                if (issue) {
                    res += `📌 **VẤN ĐỀ: ${issue.title}**\n\n`;
                    res += `🔍 **Phân tích nguyên nhân:** ${issue.rootCause}\n\n`;
                    res += `⚠️ **Rủi ro hệ quả:** ${issue.risks}\n\n`;
                    res += `✅ **Giải pháp cấu trúc:** ${issue.solution}\n\n`;
                    res += `📝 **Ví dụ thực tế:** ${issue.example}\n\n`;
                    res += `🚀 **Tối ưu công nghệ:** ${issue.tech}\n\n`;
                    res += `------------------------------------------\n\n`;
                }
            });
            return res;
        }

        return "Hiện tại hệ thống STA chưa có dữ liệu về nội dung này.";
    }

    // --- EVENT LISTENERS ---
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                appendMessage('user', message);
                chatInput.value = '';
                setTimeout(() => {
                    let response = getAIResponse(message);
                    // Add follow-up question if it's not a greeting or error
                    if (!response.includes("Mời bạn chia sẻ nhu cầu")) {
                        response += "\n\n💬 **Bạn có cần mình tư vấn gì thêm nữa không?**";
                    }
                    appendMessage('ai', response);
                }, 600);
            }
        });
    }
});
