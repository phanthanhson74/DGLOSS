"use strict";

//*********************************
//*** common
//*********************************
document.addEventListener("DOMContentLoaded", function () {
  const firstText = document.querySelector(".text.first");
  const secondText = document.querySelector(".text.second");

  setTimeout(() => {
    firstText.classList.add("visible");
  }, 100);

  setTimeout(() => {
    secondText.classList.add("visible");
  }, 500);
});

document.addEventListener("DOMContentLoaded", () => {
  const floatBtns = document.querySelector(".float-btns");
  const footer = document.querySelector("footer");

  window.addEventListener("scroll", () => {
      if (!floatBtns || !footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (footerRect.top < windowHeight) {
          floatBtns.classList.add("hidden");
      } else {
          floatBtns.classList.remove("hidden");
      }
  });
});


const swiper = new Swiper(".swiper", {
  loop: true,
  paginationClickable: true,
  spaceBetween: 20,
  slidesPerView: 1,
  autoHeight: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: true,
  },
  breakpoints: {
    768: {
      slidesPerView: "auto",
    },
  },
});

const swiper02 = new Swiper(".swiper02", {
  loop: true,
  paginationClickable: true,
  spaceBetween: 20,
  slidesPerView: 1,
  autoHeight: true,
  navigation: {
    nextEl: ".swiper-button-next02",
    prevEl: ".swiper-button-prev02",
  },
  pagination: {
    el: ".swiper-pagination02",
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: true,
  },
  breakpoints: {
    768: {
      slidesPerView: "auto",
    },
  },
});

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
            "swing"
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
          var hashP = "#" + this.anchor;
          $("html, body").animate(
            {
              scrollTop: $(hashP).offset().top,
            },
            speed,
            "swing"
          );
        }
      },
    };
    $(function () {
      smoothScrollC.init();
      if (location.href.match(/\?/)) {
        setTimeout(function () {
          smoothScrollParam.init();
        }, 100);
      }
    });
  };
  smoothScroll();
});
