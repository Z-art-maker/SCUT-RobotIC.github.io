/* RobotIC site — small, dependency-free interactions */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- mobile navigation ---------- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav__links a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- header state on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- reveal on enter ---------- */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
              window.setTimeout(function () {
                el.classList.add("is-in");
              }, delay);
              io.unobserve(el);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
      );
      revealables.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealables.forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  }

  /* ---------- tabs ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll(".tab"));
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));

    var select = function (id) {
      tabs.forEach(function (tab) {
        tab.setAttribute("aria-selected", tab.dataset.tab === id ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var match = panel.dataset.panel === id;
        panel.hidden = !match;
        if (match) {
          panel.classList.remove("is-in");
          void panel.offsetWidth;
          panel.classList.add("is-in");
        }
      });
    };

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab.dataset.tab);
      });
    });

    if (tabs.length) {
      select(tabs[0].dataset.tab);
    }
  });

  /* ---------- lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox__close");

    var close = function () {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lbImg.src = btn.dataset.lightbox;
        lbImg.alt = btn.dataset.caption || "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();

// 在 main.js 中添加
document.querySelectorAll('.card, .showcase__item').forEach(card => {
  let rafId = null;
  const updateTilt = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // 最大倾斜10度
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s ease-out'; // 平滑跟随
  };

  card.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => updateTilt(e));
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; // 平滑复位
  });
});

// 在 main.js 中添加
const heroSection = document.querySelector('.hero');
const heroImage = document.querySelector('.hero__media img'); // 假设图片选择器

if (heroSection && heroImage) {
  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // 计算鼠标相对于屏幕中心的位置，范围 -0.5 到 0.5
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;

    // 图片3D倾斜
    heroImage.style.transform = `perspective(1200px) rotateX(${y * 6}deg) rotateY(${x * -6}deg) scale(1.05)`;

    // 如果想让标题也有聚光灯效果，可以在这里更新CSS变量
    heroSection.style.setProperty('--spotlight-x', `${clientX}px`);
    heroSection.style.setProperty('--spotlight-y', `${clientY}px`);
  });

  heroSection.addEventListener('mouseleave', () => {
    heroImage.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
  });
}
