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

  function setupSearch() {
    $(".site-search").on("input", function () {
      var query = $(this).val().toLowerCase().trim();
      $(".searchable").each(function () {
        var text = $(this).text().toLowerCase();
        $(this).toggleClass("is-hidden", query.length > 0 && !text.includes(query));
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

  $(function () {
    setupNavigation();
    setupSearch();
    setupVisitorCounter();
    setupForms();
    setupForum();
  });
})(jQuery);
