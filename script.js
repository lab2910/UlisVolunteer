/* ===== VolunteerHub Frontend (NO BACKEND - STATIC) ===== */
(() => {

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    // ==========================
    // 1️⃣ DỮ LIỆU SỰ KIỆN THỦ CÔNG (9 SỰ KIỆN)
    // ==========================
    const EVENTS = [
        {
            eventId: 1,
            eventName: "Tiếp sức mùa thi 2025",
            location: "Hà Nội",
            date: "2025-06-20",
            description: "Hỗ trợ thí sinh trong kỳ thi THPT Quốc gia tại các điểm thi."
        },
        {
            eventId: 2,
            eventName: "Hiến máu Nhân đạo",
            location: "Viện Huyết học Trung Ương",
            date: "2025-07-05",
            description: "Chương trình hiến máu tình nguyện nhằm cứu giúp bệnh nhân cần máu."
        },
        {
            eventId: 3,
            eventName: "Dọn rác – Bảo vệ môi trường",
            location: "Hồ Tây",
            date: "2025-07-12",
            description: "Cùng nhau làm sạch môi trường, nâng cao ý thức bảo vệ thiên nhiên."
        },
        {
            eventId: 4,
            eventName: "Xuân yêu thương vùng cao",
            location: "Hà Giang",
            date: "2025-01-15",
            description: "Trao quà và hỗ trợ trẻ em có hoàn cảnh khó khăn tại vùng cao."
        },
        {
            eventId: 5,
            eventName: "Tình nguyện viên hỗ trợ Trung thu",
            location: "Nam Định",
            date: "2025-09-10",
            description: "Hỗ trợ tổ chức chương trình Trung thu cho các em nhỏ."
        },
        {
            eventId: 6,
            eventName: "Góp mì cho em 3",
            location: "Hà Nội",
            date: "2025-08-01",
            description: "Tuyển tình nguyện viên tham gia trực tiếp chương trình Góp mì cho em lần 3."
        },
        {
            eventId: 7,
            eventName: "Dự án Ngọn Đèn Tâm Hồn",
            location: "Hà Nội",
            date: "2025-08-15",
            description: "Tuyển tình nguyện viên cho dự án hỗ trợ tâm lý, giáo dục cho trẻ em."
        },
        {
            eventId: 8,
            eventName: "Chủ nhật xanh",
            location: "Đà Nẵng",
            date: "2025-07-21",
            description: "Hoạt động thu gom rác, trồng cây xanh và bảo vệ môi trường."
        },
        {
            eventId: 9,
            eventName: "Dạy học miễn phí cho trẻ em khó khăn",
            location: "Hồ Chí Minh",
            date: "2025-09-01",
            description: "Tham gia giảng dạy và hỗ trợ học tập cho trẻ em có hoàn cảnh khó khăn."
        }
    ];

    const state = { events: EVENTS, filtered: [] };

    // ==========================
    // 2️⃣ HELPER
    // ==========================
    const escapeHTML = (s) =>
        String(s ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const fmtDate = v => new Date(v).toLocaleDateString("vi-VN");

    const toast = (msg, type = "info") => {
        const host = $("#toast");
        const node = document.createElement("div");
        node.className = `toast ${type}`;
        node.textContent = msg;
        host.appendChild(node);
        setTimeout(() => node.remove(), 2600);
    };

    // ==========================
    // 3️⃣ MODAL
    // ==========================
    const openModal = (ev) => {
        $("#modal").classList.add("show");
        $("#modalEventName").textContent = ev.eventName;
        $("#eventId").value = ev.eventId;
        $("#fullName").focus();
    };

    const closeModal = () => {
        $("#modal").classList.remove("show");
        $("#regForm").reset();
        $$(".err").forEach(e => e.textContent = "");
    };

    // ==========================
    // 4️⃣ RENDER
    // ==========================
    const renderGrid = (rows) => {
        const grid = $("#grid");
        const empty = $("#empty");

        if (!rows.length) {
            grid.innerHTML = "";
            empty.classList.remove("hidden");
            return;
        }

        empty.classList.add("hidden");

        grid.innerHTML = rows.map(ev => `
            <article class="card">
                <h3 class="card__title">${escapeHTML(ev.eventName)}</h3>
                <p class="meta">Địa điểm: <span>${escapeHTML(ev.location)}</span></p>
                <p class="meta">Ngày: <span>${fmtDate(ev.date)}</span></p>
                <p class="desc">${escapeHTML(ev.description)}</p>
                <button class="btn btn--primary" data-id="${ev.eventId}">Đăng ký</button>
            </article>
        `).join("");

        $$("[data-id]").forEach(btn => {
            btn.onclick = () => {
                const ev = state.events.find(e => e.eventId == btn.dataset.id);
                if (ev) openModal(ev);
            };
        });
    };

    // ==========================
    // 5️⃣ FILTER
    // ==========================
    const buildLocations = () => {
        const select = $("#locationSelect");
        const locs = [...new Set(state.events.map(e => e.location))];
        select.innerHTML = `<option value="">Tất cả khu vực</option>` +
            locs.map(l => `<option value="${l}">${l}</option>`).join("");
    };

    const applyFilters = () => {
        const q = $("#searchInput").value.toLowerCase();
        const loc = $("#locationSelect").value;

        state.filtered = state.events.filter(e =>
            (!q || e.eventName.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) &&
            (!loc || e.location === loc)
        );

        renderGrid(state.filtered);
    };

    // ==========================
    // 6️⃣ SUBMIT (FAKE SUCCESS)
    // ==========================
    $("#regForm").onsubmit = (e) => {
        e.preventDefault();

        setTimeout(() => {
            toast("🎉 Đăng ký thành công!", "success");
            closeModal();
        }, 600);
    };

    // ==========================
    // 7️⃣ INIT
    // ==========================
    document.addEventListener("DOMContentLoaded", () => {
        buildLocations();
        applyFilters();

        $("#searchInput").oninput = () => {
            clearTimeout(applyFilters._t);
            applyFilters._t = setTimeout(applyFilters, 200);
        };

        $("#locationSelect").onchange = applyFilters;

        document.addEventListener("click", e => {
            if (e.target.matches("[data-close]")) closeModal();
        });

        document.addEventListener("keydown", e => {
            if (e.key === "Escape") closeModal();
        });
    });

})();
