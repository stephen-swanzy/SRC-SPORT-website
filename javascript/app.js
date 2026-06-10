(function ($) {
  "use strict";

  function setupNavigation() {
    $(".nav-toggle").on("click", function () {
      var nav = $(".site-nav");
      var isOpen = nav.toggleClass("open").hasClass("open");
      $(this).attr("aria-expanded", isOpen);
      $(this).attr("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
  }

  function setupPageLoader() {
    setTimeout(function () {
      $(".page-loader").addClass("hidden");
    }, 500);
  }

  function setupSearch() {
    $(".site-search").on("input", function () {
      var query = $(this).val().toLowerCase().trim();
      $(".searchable").each(function () {
        var text = $(this).text().toLowerCase();
        $(this).toggleClass("is-hidden", query.length > 0 && !text.includes(query));
      });
    });
  }

  function setupProgrammeFilters() {
    $(".filter-button").on("click", function () {
      var filter = String($(this).attr("data-filter") || "all");

      $(".filter-button").removeClass("active");
      $(this).addClass("active");

      $(".sports-grid .sport-card").each(function () {
        var category = String($(this).attr("data-category") || "");
        $(this).toggleClass("is-hidden", filter !== "all" && category !== filter);
      });
    });
  }

  function setupVisitorCounter() {
    var counter = $("#visitor-count");
    if (!counter.length) {
      return;
    }
    var visits = Number(localStorage.getItem("srcSportsVisits") || "0") + 1;
    localStorage.setItem("srcSportsVisits", String(visits));
    counter.text(visits);
  }

  function captchaIsValid(form) {
    var captchaInput = form.find("[name='captcha']");
    if (!captchaInput.length) {
      return true;
    }
    var value = Number(captchaInput.val());
    return value === 7;
  }

  function setupForms() {
    $(".validate-form").on("submit", function (event) {
      event.preventDefault();
      var form = $(this);
      var message = form.find(".form-message");

      if (!this.checkValidity()) {
        message.text("Please complete all required fields correctly.");
        this.reportValidity();
        return;
      }

      if (!captchaIsValid(form)) {
        message.text("CAPTCHA answer is incorrect. Please try again.");
        return;
      }

      if (form.data("form-type") === "booking") {
        var subject = encodeURIComponent("SRC Sports Academy booking request");
        var body = encodeURIComponent(
          "Name: " + form.find("[name='fullName']").val() +
          "\nEmail: " + form.find("[name='email']").val() +
          "\nSport: " + form.find("[name='sport']").val() +
          "\nDate: " + form.find("[name='date']").val() +
          "\nTime: " + form.find("[name='time']").val() +
          "\nNotes: " + form.find("[name='notes']").val()
        );
        message.html("Booking request prepared. <a href=\"mailto:srcsportsacademy@example.com?subject=" + subject + "&body=" + body + "\">Open email confirmation</a>.");
      } else if (form.data("form-type") === "contact") {
        message.text("Message sent. We will get back to you soon.");
      } else {
        message.text("Registration received. A simulated confirmation email has been sent.");
      }

      form[0].reset();
    });
  }

  function setupForum() {
    $(".forum-form").on("submit", function (event) {
      event.preventDefault();
      var name = $("#question-name").val().trim();
      var question = $("#question-text").val().trim();

      if (!name || !question) {
        return;
      }

      var card = $("<article class=\"question-card searchable\"></article>");
      card.append($("<h3></h3>").text(question));
      card.append($("<p></p>").text("Posted by " + name + ". A coach will respond during the next update."));
      $("#forum-list").prepend(card);
      this.reset();
    });
  }

  function setupLightbox() {
    var lightbox = $(".lightbox");
    var image = lightbox.find("img");
    var caption = lightbox.find("p");

    $(".gallery-card").on("click", function () {
      image.attr("src", $(this).data("lightbox-src"));
      image.attr("alt", $(this).data("lightbox-caption"));
      caption.text($(this).data("lightbox-caption"));
      lightbox.addClass("open").attr("aria-hidden", "false");
    });

    $(".lightbox-close, .lightbox").on("click", function (event) {
      if (event.target !== this) {
        return;
      }
      lightbox.removeClass("open").attr("aria-hidden", "true");
      image.attr("src", "");
    });

    $(document).on("keydown", function (event) {
      if (event.key === "Escape") {
        lightbox.removeClass("open").attr("aria-hidden", "true");
        image.attr("src", "");
      }
    });
  }

  function setupBackToTop() {
    var button = $(".back-to-top");

    $(window).on("scroll", function () {
      button.toggleClass("visible", window.scrollY > 500);
    });

    button.on("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupScheduleDownload() {
    $(".download-schedule").on("click", function () {
      var lines = [
        "SRC Sports Academy Weekly Timetable",
        "",
        "Monday: Football drills | 12-16 years | Main field",
        "Tuesday: Martial arts | 10-18 years | Gym hall",
        "Wednesday: Gymnastics | 8-14 years | Practice studio",
        "Thursday: Volleyball | 14-18 years | Sports court",
        "Friday: Team training | All ages | Field and gym"
      ];
      var blob = new Blob([lines.join("\n")], { type: "text/plain" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "src-sports-academy-timetable.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  function setupScrollReveal() {
    var revealItems = $(".section, .search-panel").addClass("reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.addClass("visible");
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.each(function () {
      observer.observe(this);
    });
  }

  $(function () {
    setupPageLoader();
    setupNavigation();
    setupSearch();
    setupProgrammeFilters();
    setupVisitorCounter();
    setupForms();
    setupForum();
    setupLightbox();
    setupBackToTop();
    setupScheduleDownload();
    setupScrollReveal();
  });
})(jQuery);
