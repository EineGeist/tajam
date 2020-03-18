'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Modal = /*#__PURE__*/function () {
  function Modal(options) {
    _classCallCheck(this, Modal);

    this.$page = $('body');

    if (options.addFullscreenBtn) {
      // fullscreen button won't show if browser doesn't support Fullscreen API
      options.addFullscreenBtn = this.checkFullscreenSupport;
    }

    this.options = options;
    this.buildOverlay().buildContentWindow();

    if (options.buildMenu) {
      this.buildMenu();
    }

    this.setUpEventListeners();
  }

  _createClass(Modal, [{
    key: "buildOverlay",
    value: function buildOverlay() {
      this.$modalOverlay = $(document.createElement('div')).addClass('modal-overlay');
      return this.styleOverlay();
    }
  }, {
    key: "styleOverlay",
    value: function styleOverlay() {
      this.$modalOverlay.css({
        'z-index': 9000,
        'position': 'fixed',
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0,
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'cursor': 'pointer',
        'background-color': 'rgba(0, 0, 0, 0.6)'
      });
      return this;
    }
  }, {
    key: "buildContentWindow",
    value: function buildContentWindow() {
      this.$modalContent = $(document.createElement('div')).appendTo(this.$modalOverlay);
      return this.styleContentWindow();
    }
  }, {
    key: "styleContentWindow",
    value: function styleContentWindow() {
      this.$modalContent.css({
        'display': 'flex',
        'align-items': 'center',
        'cursor': 'auto'
      });
      return this;
    }
  }, {
    key: "buildMenu",
    value: function buildMenu() {
      var options = this.options,
          $modalOverlay = this.$modalOverlay;
      var $menu = this.$menu = $(document.createElement('div')).addClass('modal_menu').appendTo($modalOverlay);

      if (options.addFullscreenBtn) {
        this.$fullscreenBtn = $(document.createElement('span')).addClass('modal_btn modal_btn-fullSize').appendTo($menu);
        this.setFullscreenBtnIcon();
      }

      if (options.addCloseBtn || options.addCloseBtn === undefined) {
        this.$closeBtn = $(document.createElement('span')).html('&#xea0f;').addClass('modal_btn modal_btn-close').appendTo($menu);
      }

      return this.styleMenu();
    }
  }, {
    key: "styleMenu",
    value: function styleMenu() {
      var $menu = this.$menu,
          $fullscreenBtn = this.$fullscreenBtn,
          $closeBtn = this.$closeBtn;
      $menu.css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'flex-end',
        'height': '100px',
        'width': '100%',
        'padding': '10px',
        'background-color': 'rgba(0, 0, 0, 0.8)',
        'cursor': 'auto'
      });
      $fullscreenBtn.add($closeBtn).css({
        'max-width': '100%',
        // IE fix
        'margin-left': '30px',
        'font-family': 'icomoon',
        'font-size': '30px',
        'color': 'white',
        'cursor': 'pointer'
      });
      return this;
    }
  }, {
    key: "setUpEventListeners",
    value: function setUpEventListeners() {
      var $modalOverlay = this.$modalOverlay,
          $closeBtn = this.$closeBtn,
          $fullscreenBtn = this.$fullscreenBtn;
      $modalOverlay.on('click', function (e) {
        if ($(e.target).is('.modal-overlay')) this.closeModal();
      }.bind(this));
      $(document).on('keydown', function (e) {
        if (e.key === 'Escape') this.closeModal();
      }.bind(this));

      if ($closeBtn) {
        $closeBtn.on('click', this.closeModal.bind(this));
      }

      if ($fullscreenBtn) {
        $fullscreenBtn.on('click', this.toggleFullscreen.bind(this)); // Handling promise doesn't work properly

        document.addEventListener('fullscreenchange', function () {
          this.setFullscreenBtnIcon();
        }.bind(this));
      }

      return this;
    }
  }, {
    key: "checkFullscreenSupport",
    value: function checkFullscreenSupport() {
      return document.fullscreenEnabled || document.webkitFullScreenEnabled || document.mozFullScreenEnabled || document.msFullScreenEnabled;
    }
  }, {
    key: "inFullscreen",
    value: function inFullscreen() {
      return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    }
  }, {
    key: "openFullscreen",
    value: function openFullscreen(el) {
      var promise;
      if (el.requestFullscreen) promise = el.requestFullscreen();else if (el.webkitRequestFullScreen) promise = el.webkitRequestFullScreen();else if (el.mozRequestFullScreen) promise = el.mozRequestFullScreen();else if (el.msRequestFullscreen) promise = el.msRequestFullscreen();
      return promise;
    }
  }, {
    key: "closeFullscreen",
    value: function closeFullscreen() {
      var promise;
      if (document.exitFullscreen) promise = document.exitFullscreen();else if (document.webkitExitFullscreen) promise = document.webkitExitFullscreen();else if (document.mozCancelFullScreen) promise = document.mozCancelFullScreen();else if (document.msExitFullscreen) promise = document.msExitFullscreen();
      return promise;
    }
  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      if (this.inFullscreen()) {
        this.closeFullscreen();
      } else {
        this.openFullscreen(this.$modalOverlay.get(0));
      }
    }
  }, {
    key: "setFullscreenBtnIcon",
    value: function setFullscreenBtnIcon() {
      if (this.inFullscreen()) {
        this.$fullscreenBtn.html('&#xe98c;');
      } else {
        this.$fullscreenBtn.html('&#xe98b;');
      }
    }
  }, {
    key: "showModal",
    value: function showModal() {
      this.overflowState = this.$page.css('overflow');
      this.$page.css('overflow', 'hidden').append(this.$modalOverlay);
      return this;
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      this.$page.css('overflow', this.overflowState);
      $('.modal-overlay').remove();
      return this;
    }
  }]);

  return Modal;
}();

var ModalGalleryViewer = /*#__PURE__*/function (_Modal) {
  _inherits(ModalGalleryViewer, _Modal);

  function ModalGalleryViewer(images, $clickedImage) {
    var _this;

    _classCallCheck(this, ModalGalleryViewer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalGalleryViewer).call(this, {
      buildMenu: true,
      addFullscreenBtn: true,
      addCloseBtn: true
    }));
    _this.$clickedImage = $clickedImage;
    _this.currentIndex = images.getImageIndex($clickedImage);
    _this.images = images;
    _this.imagesAmount = images.$previews.length;

    _this.renderGallery();

    return _this;
  }

  _createClass(ModalGalleryViewer, [{
    key: "styleOverlay",
    value: function styleOverlay() {
      _get(_getPrototypeOf(ModalGalleryViewer.prototype), "styleOverlay", this).call(this);

      this.$modalOverlay.css('background-color', '#000000');
      return this;
    }
  }, {
    key: "styleContentWindow",
    value: function styleContentWindow() {
      _get(_getPrototypeOf(ModalGalleryViewer.prototype), "styleContentWindow", this).call(this);

      this.$modalContent.css({
        'height': '100%',
        'width': '100%'
      });
      return this;
    }
  }, {
    key: "getNewFigure",
    value: function getNewFigure(index) {
      if (isFinite(index)) {
        return new ImageGalleryFigure(this.images.getImageByIndex(index, 'full')).$figure;
      }

      return new ImageGalleryFigure(this.images.getFullSizeImage(index)).$figure;
    }
  }, {
    key: "getNewNavigation",
    value: function getNewNavigation() {
      return new ImageGalleryNavigation();
    }
  }, {
    key: "renderGallery",
    value: function renderGallery() {
      this.$figure = this.getNewFigure(this.$clickedImage);
      this.$navigation = this.getNewNavigation();
      this.$modalContent.append(this.$figure).append(this.$navigation);
      this.showModal();
    }
  }, {
    key: "updateGallery",
    value: function updateGallery() {
      var $figure = this.$figure,
          $navigation = this.$navigation,
          currentIndex = this.currentIndex,
          $modalContent = this.$modalContent;
      $figure.remove();
      $navigation.remove();
      var $newFigure = this.getNewFigure(currentIndex);
      var $newNavigation = this.getNewNavigation();
      $modalContent.append($newFigure).append($newNavigation);
      this.$figure = $newFigure;
      this.$navigation = $newNavigation;
    }
  }, {
    key: "setUpEventListeners",
    value: function setUpEventListeners() {
      _get(_getPrototypeOf(ModalGalleryViewer.prototype), "setUpEventListeners", this).call(this);

      this.$modalOverlay.on('click', this.navigationBtnHandler.bind(this));
      $(document).on('keydown', this.navigationKeyHandler.bind(this));
      return this;
    }
  }, {
    key: "navigationBtnHandler",
    value: function navigationBtnHandler(e) {
      var $target = $(e.target);
      var $button = $target.closest('.scroll');
      if (!$button.length) return;
      if ($button.is('.scroll-prev')) this.scrollBack();else if ($button.is('.scroll-next')) this.scrollForward();
    }
  }, {
    key: "navigationKeyHandler",
    value: function navigationKeyHandler(e) {
      if (e.key === 'ArrowLeft') this.scrollBack();else if (e.key === 'ArrowRight') this.scrollForward();
    }
  }, {
    key: "scrollBack",
    value: function scrollBack() {
      var imagesAmount = this.imagesAmount;
      var index = this.currentIndex;
      index--;
      if (index < 0) index = imagesAmount - 1;
      this.scrollTo(index);
    }
  }, {
    key: "scrollForward",
    value: function scrollForward() {
      var imagesAmount = this.imagesAmount;
      var index = this.currentIndex;
      index++;
      if (index > imagesAmount - 1) index = 0;
      this.scrollTo(index);
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(index) {
      this.currentIndex = index;
      this.updateGallery();
    }
  }]);

  return ModalGalleryViewer;
}(Modal);

var ImageGalleryFigure = /*#__PURE__*/function () {
  function ImageGalleryFigure($image) {
    _classCallCheck(this, ImageGalleryFigure);

    this.$image = $image;
  }

  _createClass(ImageGalleryFigure, [{
    key: "$figure",
    get: function get() {
      return $(document.createElement('figure')).append(this.$figimage).append(this.$figcaption).css({
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'overflow': 'hidden',
        'width': '100%',
        'height': '100%'
      });
    }
  }, {
    key: "$figimage",
    get: function get() {
      return this.$image.css({
        'display': 'block',
        'max-width': '100%',
        'max-height': '100%'
      });
    }
  }, {
    key: "$figcaption",
    get: function get() {
      var caption = this.$image.data('caption');
      if (caption === null) return null;
      var $figcaptionContent = $(document.createElement('div')).html(caption).css({
        'display': 'inline-block',
        'min-height': '100px',
        'padding': '10px 0',
        'text-align': 'center'
      });
      return $(document.createElement('figcaption')).html($figcaptionContent).css({
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'display': 'flex',
        'justify-content': 'center',
        'width': '100%',
        'background-color': 'rgba(0, 0, 0, 0.8)',
        'color': '#ffffff'
      });
    }
  }]);

  return ImageGalleryFigure;
}();

var ImageGalleryNavigation = /*#__PURE__*/function () {
  function ImageGalleryNavigation() {
    _classCallCheck(this, ImageGalleryNavigation);

    return $(document.createElement('nav')).append(this.$scrollPrevBtn).append(this.$scrollNextBtn);
  }

  _createClass(ImageGalleryNavigation, [{
    key: "$scrollPrevBtn",
    get: function get() {
      return $(document.createElement('button')).addClass('scroll scroll-prev').html('&#xea40;').css(this.scrollBtnStyle).css('left', 0);
    }
  }, {
    key: "$scrollNextBtn",
    get: function get() {
      return $(document.createElement('button')).addClass('scroll scroll-next').html('&#xea3c;').css(this.scrollBtnStyle).css('right', 0);
    }
  }, {
    key: "scrollBtnStyle",
    get: function get() {
      return {
        'position': 'fixed',
        'top': 'calc(50% - 25px)',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'width': '50px',
        'height': '50px',
        'background-color': 'rgba(0, 0, 0, .4)',
        'border': 0,
        'border-radius': '50%',
        'outline': 0,
        'font-family': 'Icomoon',
        'font-size': '30px',
        'line-height': 1,
        'color': 'white'
      };
    }
  }]);

  return ImageGalleryNavigation;
}();

var WorksGallery = /*#__PURE__*/function () {
  function WorksGallery($gallery) {
    _classCallCheck(this, WorksGallery);

    this.$gallery = $gallery;
    this.$imagesContainer = $gallery.children('.works_images-container');
    this.$images = $gallery.find('.works_image');
    this.isCollapsed = true;
    this.setContainerHeight(0);
    this.setUpEventListeners();
  }

  _createClass(WorksGallery, [{
    key: "setUpEventListeners",
    value: function setUpEventListeners() {
      this.$gallery.on('click', this.toggleButtonHandler.bind(this));
      this.$imagesContainer.on('click', this.openGalleryViewerHandler.bind(this));
      $(window).on('resize', this.pageResizeHandler.bind(this));
    }
  }, {
    key: "pageResizeHandler",
    value: function pageResizeHandler() {
      this.setContainerHeight(0);
    }
  }, {
    key: "openGalleryViewerHandler",
    value: function openGalleryViewerHandler(e) {
      var $target = $(e.target);
      if (!($target.is('figcaption') || $target.is('.works_image'))) return;
      var $clickedFigure = $target.closest('.works_figure');

      if ($clickedFigure.length) {
        var $clickedImage = $clickedFigure.find('.works_image');
        var images = new WorksGalleryImages(this.$gallery);
        new ModalGalleryViewer(images, $clickedImage);
      }
    } //*********** Toggle Button Methods ***********//

  }, {
    key: "toggleButtonHandler",
    value: function toggleButtonHandler(e) {
      var $target = $(e.target);
      var $toggleButton = $target.closest('.gallery-collapse-toggle');
      if ($toggleButton.length) this.toggleCollapse($toggleButton);
    }
  }, {
    key: "toggleCollapse",
    value: function toggleCollapse($toggleButton) {
      this.isCollapsed = !this.isCollapsed;

      if (this.isCollapsed) {
        $toggleButton.text('Load more');
      } else {
        $toggleButton.text('Hide');
      }

      this.setContainerHeight(300);
    }
  }, {
    key: "setContainerHeight",
    value: function setContainerHeight() {
      var animationDuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var isCollapsed = this.isCollapsed,
          $imagesContainer = this.$imagesContainer;

      if (isCollapsed) {
        var imageHeight = this.$images.height();
        $imagesContainer.animate({
          'max-height': imageHeight * 2
        }, animationDuration);
      } else {
        $imagesContainer.animate({
          'max-height': $imagesContainer.get(0).scrollHeight
        }, animationDuration);
      }
    }
  }]);

  return WorksGallery;
}();

var WorksGalleryImages = /*#__PURE__*/function () {
  function WorksGalleryImages($gallery) {
    _classCallCheck(this, WorksGalleryImages);

    this.$gallery = $gallery;
    this.setPreviewsImages();
  }

  _createClass(WorksGalleryImages, [{
    key: "setPreviewsImages",
    value: function setPreviewsImages() {
      this.$previews = this.$gallery.find('.works_image');
      return this;
    }
  }, {
    key: "getFullSizeImage",
    value: function getFullSizeImage($image) {
      var index = this.getImageIndex($image);
      var link = "files/img/image_".concat(index + 1, ".jpg");
      var caption = this.$previews.eq(index).siblings('.works_caption').html();
      if (caption === undefined) caption = null;
      return $(document.createElement('img')).attr('src', link).data('caption', caption);
    }
  }, {
    key: "getImageIndex",
    value: function getImageIndex($image) {
      var $previews = this.$previews;

      for (var i = 0; i < $previews.length; i++) {
        if ($image.is($previews.eq(i))) return i;
      }
    }
  }, {
    key: "getImageByIndex",
    value: function getImageByIndex(index) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'full';
      if (type === 'full') return this.getFullSizeImage(this.$previews.eq(index));else if (type === 'preview') return this.$previews.eq(index);
    }
  }]);

  return WorksGalleryImages;
}();

var isAnchorLink = function isAnchorLink($el) {
  var $linkEl = $el.closest('a');
  if (!$linkEl.length) return false;
  var href = $linkEl.attr('href');
  if (!href) return false;
  return href[0] === '#' && href.length > 1;
};

var isPlaceholderLink = function isPlaceholderLink($el) {
  var $linkEl = $el.closest('a');
  if (!$linkEl.length) return false;
  var href = $linkEl.attr('href');
  if (!href) return false;
  return href.length === 1 && href[0] === '#';
};

var setUpCarousels = function setUpCarousels() {
  $('.home_carousel').owlCarousel({
    items: 1,
    loop: true,
    dotsClass: 'home_dots',
    dotClass: 'home_dot'
  });
  $('.testimonials_carousel').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    navContainerClass: 'testimonials_nav',
    navText: ['<img src="files/assets/arrow_prev.png" class="testimonials_prev" alt="Previous">', '<img src="files/assets/arrow_next.png" class="testimonials_next" alt="Next">'],
    dotsClass: 'testimonials_dots',
    dotClass: 'testimonials_dot'
  }).trigger('to.owl.carousel', 2);
};

var startVideo = function startVideo($videoContainer) {
  $videoContainer.css('background-color', '#1b1b1b').find('.start-playing').hide(300);
  $videoContainer.find('video').show(300).get(0).play();
};

var EventListeners = /*#__PURE__*/function () {
  function EventListeners() {
    _classCallCheck(this, EventListeners);

    this.$page = $('body');
    this.$page.on('click', this.preventPlaceholderScroll);
    $('.video-container').on('click', this.videoPlayHandler);
    $('form').on({
      'change': this.inputFocusoutHandler,
      'focusout': this.inputInvalidHandler
    });
  }

  _createClass(EventListeners, [{
    key: "preventPlaceholderScroll",
    value: function preventPlaceholderScroll(e) {
      var $link = $(e.target);
      if (isPlaceholderLink($link)) e.preventDefault();
    }
  }, {
    key: "videoPlayHandler",
    value: function videoPlayHandler(e) {
      var $target = $(e.target);
      if (!$target.closest('.start-playing').length) return;
      var $container = $(e.currentTarget);
      startVideo($container);
      $container.off('click', startVideo);
    }
  }, {
    key: "inputFocusoutHandler",
    value: function inputFocusoutHandler(e) {
      var $target = $(e.target);
      if (!'INPUT, TEXTAREA'.includes($target.prop('tagName'))) return;
      var $label = $target.next('.label-placeholder');
      if (!$label.length) return;

      if (!$target.val()) {
        $label.removeClass('is-removed');
        return;
      }

      if ($label.hasClass('label-placeholder')) $label.addClass('is-removed');
    }
  }, {
    key: "inputInvalidHandler",
    value: function inputInvalidHandler(e) {
      var $target = $(e.target);
      var $invalidMessage = $target.siblings('.invalid-message');
      if ($target.is(':invalid')) $invalidMessage.slideDown(300);else $invalidMessage.slideUp(300);
    }
  }]);

  return EventListeners;
}();

var pageNavigation = {
  isCollapsed: true,
  $pageNavigation: $('.page-nav'),
  $button: $('.page-nav_toggle'),
  toggleListener: function toggleListener() {
    this.$button.on('click', this.toggle.bind(this));
    return this;
  },
  toggle: function toggle() {
    var $pageNavigation = this.$pageNavigation,
        $button = this.$button;
    var isCollapsed = this.isCollapsed = !this.isCollapsed;

    if (isCollapsed) {
      $pageNavigation.removeClass('is-expand');
      $button.removeClass('is-cross').addClass('is-menu');
    } else {
      $pageNavigation.addClass('is-expand');
      $button.removeClass('is-menu').addClass('is-cross');
    }
  },
  anchorLinkListener: function anchorLinkListener() {
    var _this2 = this;

    this.$pageNavigation.on('click', function (e) {
      var $target = $(e.target);
      if (!isAnchorLink($target)) return;
      $('html').add('body').animate({
        scrollTop: $($target.attr('href')).offset().top
      }, 400, 'swing');

      if (window.innerWidth <= 1024) {
        _this2.toggle();
      }
    });
    return this;
  }
};
$(function () {
  $('body').css('overflow', 'auto');
  $('.preloader').fadeOut(300);
  setUpCarousels();
  autosize($('.textarea-autosize'));
  pageNavigation.toggleListener().anchorLinkListener();
  new EventListeners();
  new WorksGallery($('#works_gallery'));
});
