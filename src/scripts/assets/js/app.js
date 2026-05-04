"use strict";

//*********************************
//*** common
//*********************************

$(function () {
  var smoothScroll = function () {
    var $header = $(".page-header");
    var headerHeight = $header.innerHeight();
    var speed = 500;

    var smoothScrollC = {
      init: function () {
        var me = this;

        $('a[href^="#"]').on("click", function (e) {
          e.preventDefault();
          me.targetScroll($(this));
        });
      },

      targetScroll: function ($target) {
        var $hash = $($target.attr("href"));

        if ($hash.length) {
          $("html, body").animate(
            {
              scrollTop: $hash.offset().top,
            },
            speed,
            "swing",
          );
        }
      },
    };

    var smoothScrollParam = {
      location: location.pathname,

      init: function () {
        var me = this;

        if (!this.location.match("/admin/")) {
          if (location.search.match("anc=")) {
            me.anchor = location.search.split("anc=")[1];
          } else {
            me.anchor = location.search.split(/\?/)[1];
          }

          var hashP = "#" + me.anchor;
          var $target = $(hashP);

          if ($target.length) {
            $("html, body").animate(
              {
                scrollTop: $target.offset().top,
              },
              speed,
              "swing",
            );
          }
        }
      },
    };

    $(function () {
      smoothScrollC.init();

      if (location.href.match(/\?/)) {
        setTimeout(function () {
          smoothScrollParam.init();
        }, 300);
      }
    });
  };

  smoothScroll();
});

/* Header Function
 ********************************************** */
const initHeader = () => {
  const header = document.querySelector(".l-header");
  const headerHamburger = document.querySelector(".js-hamburger");
  const navToggles = document.querySelectorAll(".js-toggle-nav");
  const headerNav = document.querySelector(".l-header__nav");

  const handleHeaderState = () => {
    const isExpanded = headerHamburger.getAttribute("aria-expanded") === "true";

    const shouldActive = isExpanded || window.scrollY > 10;

    header.classList.toggle("active", shouldActive);
  };

  navToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isExpanded =
        headerHamburger.getAttribute("aria-expanded") === "true";

      headerHamburger.setAttribute("aria-expanded", String(!isExpanded));
      headerNav.classList.toggle("is-active");
      document.documentElement.classList.toggle("no-scroll");

      handleHeaderState();
    });
  });

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleHeaderState();
        ticking = false;
      });
      ticking = true;
    }
  });

  handleHeaderState();
};

const smoothScrollFromQuery = {
  location: location.pathname,

  init: function () {
    // Skip if in admin panel
    if (this.location.includes("/admin/")) return;

    const params = new URLSearchParams(location.search);
    const anchor = params.get("anc") || params.keys().next().value;
    const selector = anchor ? `#${anchor}` : null;
    const target = selector ? document.querySelector(selector) : null;

    if (target) {
      // Delay to ensure DOM is fully ready
      setTimeout(() => {
        scrollToTarget(target);
      }, 700); // Matches jQuery animate delay
    }
  }
};

// Run query-based scroll on page load if URL has query string
if (location.search) {
  setTimeout(() => {
    smoothScrollFromQuery.init();
  }, 100);
}

initHeader();
