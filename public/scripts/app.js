$(document).ready(function () {

  /*--------------------------------------------------------------
  SEARCHBAR START
  --------------------------------------------------------------*/
  var sp = document.querySelector('.iconbox-search');
  var searchbar = document.querySelector('.iconbox-searchbar');
  var shclose = document.querySelector('.search-close');

  function changeClass() {
    searchbar.classList.add('search-visible');
  }

  function closesearch() {
    searchbar.classList.remove('search-visible');
  }
  sp.addEventListener('click', changeClass);
  shclose.addEventListener('click', closesearch);
  /*--------------------------------------------------------------
  SEARCHBAR END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
  TOOLTIP START
  --------------------------------------------------------------*/
  $('[data-toggle="tooltip"]').tooltip()
  /*--------------------------------------------------------------
  TOOLTIP END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
  CAROUSAL START
  --------------------------------------------------------------*/
  $('.owl-carousel').owlCarousel({
    loop: false,
    margin: 2,
    nav: false,
    items: 4
  })
  /*--------------------------------------------------------------
  CAROUSAL END
  --------------------------------------------------------------*/

  /*--------------------------------------------------------------
  PERFECT SCROLLBAR START
  --------------------------------------------------------------*/
  var selectors = ['.sidebar-userlist', '.sidebar-contactlist', '.conversation-panel__body', '.information-panel__body', '.ca-call-details-history', '.ca-content__contactstab', '.modal-contact-list', '.profile-settings-list'];
  selectors.forEach(function (selector) {
    $(selector).each(function () {
      const ps = new PerfectScrollbar($(this)[0], {
        suppressScrollX: true
      });
      ps.isRtl = false;
      ps.update();
    });
  });
  /*--------------------------------------------------------------
  PERFECT SCROLLBAR END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
  INFORMATION PANEL START
  --------------------------------------------------------------*/

  $(".personalinfo-panel-opener").on('click', function () {
    $("body").addClass("info-panel-opened");
    $(".backdrop-overlay").removeClass("hidden");
    $(".theme-customizer").removeClass("active");
  });
  $(".groupinfo-panel-opener").on('click', function () {
    $("body").addClass("info-panel-opened");
    $(".backdrop-overlay").removeClass("hidden");
  });
  $(".information-panel__closer").on('click', function () {
    $("body").removeClass("info-panel-opened");
    $(".backdrop-overlay").addClass("hidden");
  });
  /*--------------------------------------------------------------
  INFORMATION PANEL END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
  SETTINGS PANEL START
  --------------------------------------------------------------*/

  $(function () {
    var $window = $(window),
      $body = $('.settings-nav-menu .nav .nav-link');

    function resize() {
      if ($window.width() < 768) {
        return $body.removeClass('active');
      }
    }

    $window
      .resize(resize)
      .trigger('resize');
  })
  /*--------------------------------------------------------------
  SETTINGS PANEL END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
  MODAL START
  --------------------------------------------------------------*/
  $(".dialpad-opener").on('click', function () {
    $(".modal-contact-list").toggle();
    $(".modal-dialpad").toggle();
    $(this).find(".mdi").toggleClass("mdi-dialpad mdi-account-multiple-outline");
  });
  $(".new-group-dialog .iconbox").on('click', function () {
    $(this).toggleClass("btn-solid-info btn-solid-success")
    $(this).find(".iconbox__icon").toggleClass("mdi-plus mdi-check");
  });
  /*--------------------------------------------------------------
  MODAL END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
  DEMO CHAT JQUERY START
  --------------------------------------------------------------*/

  //chats Tab Inside
  $("#caChatsTab").on('click', function () {
    $(".ca-content__callstab, .ca-content__contactstab").hide();
    $(".ca-content__chatstab").show();
  });

  $("#personal-chat-tab").on('click', function () {
    if ($("#personal-chat .conversation").hasClass("active")) {
      $(".ca-content__chatstab--group").hide();
      $(".ca-content__chatstab--personal").show();
    } else {
      $(".ca-content__chatstab--personal, .ca-content__chatstab--group").hide();
    }
  });
  $("#groups-chat-tab").on('click', function () {
    if ($("#groups-chat .conversation").hasClass("active")) {
      $(".ca-content__chatstab--group").show();
      $(".ca-content__chatstab--personal").hide();
    } else {
      $(".ca-content__chatstab--personal, .ca-content__chatstab--group").hide();
    }
  });

  //Calls Tab Inside
  $("#caCallsTab").on('click', function () {
    $(".ca-content__chatstab, .ca-content__contactstab").hide();
    if ($(".calllist").hasClass("active")) {
      $(".ca-content__callstab").show();
    } else {
      $(".ca-content__callstab").hide();
    }
  });

  // Contacts Tab Inside
  $("#caContactsTab").on('click', function () {
    $(".ca-content__chatstab, .ca-content__callstab").hide();
    if ($(".contactlist").hasClass("active")) {
      $(".ca-content__contactstab").show();
    } else {
      $(".ca-content__contactstab").hide();
    }
  });

  /*--------------------------------------------------------------
  DEMO CHAT JQUERY END
  --------------------------------------------------------------*/


  /*--------------------------------------------------------------
   RESPONSIVE START
  --------------------------------------------------------------*/

  $(function () {
    var $window = $(window),
      $body = $('body');

    function resize() {
      if ($window.width() < 992) {
        $(".conversation, .calllist, .contactlist").removeClass("active");
        $("#personal-chat .conversation").on('click', function () {
          $(this).addClass("active");
          $(".ca-content__chatstab--personal").show();
          $(".ca-content-wrapper").addClass("open");
        });
        $("#groups-chat .conversation").on('click', function () {
          $(this).addClass("active");
          $(".ca-content__chatstab--group").show();
          $(".ca-content-wrapper").addClass("open");
        });
        $("#caCalls .calllist").on('click', function () {
          $(this).addClass("active");
          $(".ca-content__callstab").show();
          $(".ca-content-wrapper").addClass("open");
        });
        $("#caContacts .contactlist").on('click', function () {
          $(this).addClass("active");
          $(".ca-content__contactstab").show();
          $(".ca-content-wrapper").addClass("open");
        });
        $(".conversation-panel__back-button").on('click', function () {
          $(".ca-content-wrapper").removeClass("open");
          $(".conversation, .calllist, .contactlist").removeClass("active");
        });
        return $body.addClass('small-devices');
      }
    }

    $window
      .resize(resize)
      .trigger('resize');
  })


  /*--------------------------------------------------------------
   RESPONSIVE END
  --------------------------------------------------------------*/
  /*--------------------------------------------------------------
  MFB EVENT START
  --------------------------------------------------------------*/
  $(function () {

    var $win = $(window); // or $box parent container
    var $box = $("#mfbMenu");

    $win.on("click.Bst", function (event) {
      if (
        $box.has(event.target).length == 0 //checks if descendants of $box was clicked
        &&
        !$box.is(event.target) //checks if the $box itself was clicked
      ) {
        $("#mfbMenu").attr('data-mfb-state', "close")
      }
    });

  });
  /*--------------------------------------------------------------
  MFB EVENT END
  --------------------------------------------------------------*/

  /*--------------------------------------------------------------
   SWITCH BETWEEN THEMES START
  --------------------------------------------------------------*/
  var themes = "light-default-theme light-purple-theme light-pink-theme light-green-theme light-red-theme light-orange-theme light-blue-theme light-darkblue-theme light-lightpink-theme dark-default-theme dark-purple-theme dark-pink-theme dark-green-theme dark-red-theme dark-orange-theme dark-blue-theme dark-darkblue-theme dark-lightpink-theme";
  $('[data-theme]').click(function () {
    $('[data-theme]').removeClass("selected");
    $(this).addClass("selected");
    $('body').removeClass(themes);
    $('body').addClass($(this).attr('data-theme'));
  });

  //RTL Layout
  $(".rtlSwitch").change(function () {
    $("body").toggleClass("rtl");
  });

  $(".theme-customizer-opener").on("click", function() {
    $(this).parents('.theme-customizer').toggleClass("active");
  });
   /*--------------------------------------------------------------
   SWITCH BETWEEN THEMES END
  --------------------------------------------------------------*/
   /*--------------------------------------------------------------
  SEARCH START
  --------------------------------------------------------------*/
  $('#userSearch').bind('keyup', function() {
    var searchString = $(this).val();
    $(".userSearchList li").each(function(index, value) {
        currentName = $(value).text()
        if( currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
            $(value).show();
        } else {
            $(value).hide();
        }
    });
  });



  // $('.search-close').click(function(){
  //     $('#userSearch').val(null)
  // });



   /*--------------------------------------------------------------
   SEARCH END
  --------------------------------------------------------------*/

});