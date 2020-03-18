'use strict';

class Modal {
  constructor(options) {
    this.$page = $('body');

    if (options.addFullscreenBtn) {
      // fullscreen button won't show if browser doesn't support Fullscreen API
      options.addFullscreenBtn = this.checkFullscreenSupport;
    }
    this.options = options;

    this
      .buildOverlay()
      .buildContentWindow();

    if (options.buildMenu) {
      this.buildMenu();
    }

    this.setUpEventListeners();
  }

  buildOverlay() {
    this.$modalOverlay = $(document.createElement('div'))
      .addClass('modal-overlay');

    return this.styleOverlay();
  }

  styleOverlay() {
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
      'background-color': 'rgba(0, 0, 0, 0.6)',
    });

    return this;
  }

  buildContentWindow() {
    this.$modalContent = $(document.createElement('div'))
      .appendTo(this.$modalOverlay);

    return this.styleContentWindow();
  }

  styleContentWindow() {
    this.$modalContent.css({
      'display': 'flex',
      'align-items': 'center',
      'cursor': 'auto',
    });

    return this;
  }

  buildMenu() {
    const {options, $modalOverlay} = this;

    const $menu = this.$menu = $(document.createElement('div'))
      .addClass('modal_menu')
      .appendTo($modalOverlay);

    if (options.addFullscreenBtn) {
      this.$fullscreenBtn = $(document.createElement('span'))
        .addClass('modal_btn modal_btn-fullSize')
        .appendTo($menu);

      this.setFullscreenBtnIcon();
    }

    if (options.addCloseBtn || options.addCloseBtn === undefined) {
      this.$closeBtn = $(document.createElement('span'))
        .html('&#xea0f;')
        .addClass('modal_btn modal_btn-close')
        .appendTo($menu);
    }

    return this.styleMenu();
  }

  styleMenu() {
    const {$menu, $fullscreenBtn, $closeBtn} = this;

    $menu.css({
      'position': 'fixed',
      'top': '0',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'flex-end',
      'height': '100px',
      'width': '100%',
      'padding': '10px',
      'background-color': 'rgba(0, 0, 0, 0.8)',
      'cursor': 'auto',
    });

    $fullscreenBtn.add($closeBtn)
      .css({
        'margin-left': '30px',
        'font-family': 'icomoon',
        'font-size': '30px',
        'color': 'white',
        'cursor': 'pointer',
      });

    return this;
  }

  setUpEventListeners() {
    const {$modalOverlay, $closeBtn, $fullscreenBtn} = this;

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
      $fullscreenBtn.on('click', this.toggleFullscreen.bind(this));
      // Handling promise doesn't work properly
      document.addEventListener('fullscreenchange', function() {
        this.setFullscreenBtnIcon();
      }.bind(this));
    }

    return this;
  }

  checkFullscreenSupport() {
    return document.fullscreenEnabled
      || document.webkitFullScreenEnabled
      || document.mozFullScreenEnabled
      || document.msFullScreenEnabled;
  }

  inFullscreen() {
    return Boolean(document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement);
  }

  openFullscreen(el) {
    let promise;

    if (el.requestFullscreen) promise = el.requestFullscreen();
    else if (el.webkitRequestFullScreen) promise = el.webkitRequestFullScreen();
    else if (el.mozRequestFullScreen) promise = el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) promise = el.msRequestFullscreen();

    return promise;
  }

  closeFullscreen() {
    let promise;

    if (document.exitFullscreen) promise = document.exitFullscreen();
    else if (document.webkitExitFullscreen) promise = document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) promise = document.mozCancelFullScreen();
    else if (document.msExitFullscreen) promise = document.msExitFullscreen();

    return promise;
  }

  toggleFullscreen() {
    if (this.inFullscreen()) {
      this.closeFullscreen();
    } else {
      this.openFullscreen(this.$modalOverlay.get(0));
    }
  }

  setFullscreenBtnIcon() {
    if (this.inFullscreen()) {
      this.$fullscreenBtn.html('&#xe98c;');
    } else {
      this.$fullscreenBtn.html('&#xe98b;');
    }
  }

  showModal() {
    this.overflowState = this.$page.css('overflow');
    this.$page
      .css('overflow', 'hidden')
      .append(this.$modalOverlay);

    return this;
  }

  closeModal() {
    this.$page.css('overflow', this.overflowState);
    $('.modal-overlay').remove();

    return this;
  }
}

class ModalGalleryViewer extends Modal {
  constructor(images, $clickedImage) {
    super({
      buildMenu: true,
      addFullscreenBtn: true,
      addCloseBtn: true,
    });

    this.$clickedImage = $clickedImage;
    this.currentIndex = images.getImageIndex($clickedImage);
    this.images = images;
    this.imagesAmount = images.$previews.length;

    this.renderGallery();
  }

  styleOverlay() {
    super.styleOverlay();
    this.$modalOverlay.css('background-color', '#000000');

    return this;
  }

  styleContentWindow() {
    super.styleContentWindow();

    this.$modalContent.css({
      'height': '100%',
      'width': '100%',
    });

    return this;
  }

  getNewFigure(index) {
    if (isFinite(index)) {
      return new ImageGalleryFigure(
        this.images.getImageByIndex(index, 'full')
      ).$figure;
    }

    return new ImageGalleryFigure(
      this.images.getFullSizeImage(index)
    ).$figure;
  }

  getNewNavigation() {
    return new ImageGalleryNavigation();
  }

  renderGallery() {
    this.$figure = this.getNewFigure(this.$clickedImage);
    this.$navigation = this.getNewNavigation();

    this.$modalContent
      .append(this.$figure)
      .append(this.$navigation);

    this.showModal();
  }

  updateGallery() {
    let {$figure, $navigation, currentIndex, $modalContent} = this;
    $figure.remove();
    $navigation.remove();

    const $newFigure = this.getNewFigure(currentIndex);
    const $newNavigation = this.getNewNavigation();

    $modalContent
      .append($newFigure)
      .append($newNavigation);

    this.$figure = $newFigure;
    this.$navigation = $newNavigation;
  }

  setUpEventListeners() {
    super.setUpEventListeners();

    this.$modalOverlay.on('click', this.navigationBtnHandler.bind(this));
    $(document).on('keydown', this.navigationKeyHandler.bind(this));

    return this;
  }

  navigationBtnHandler(e) {
    const $target = $(e.target);

    const $button = $target.closest('.scroll');
    if (!$button.length) return;
    if ($button.is('.scroll-prev')) this.scrollBack();
    else if ($button.is('.scroll-next')) this.scrollForward();
  }

  navigationKeyHandler(e) {
    if (e.key === 'ArrowLeft') this.scrollBack();
    else if (e.key === 'ArrowRight') this.scrollForward();
  }

  scrollBack() {
    const {imagesAmount} = this;
    let {currentIndex: index} = this;

    index--;
    if (index < 0) index = imagesAmount - 1;

    this.scrollTo(index);
  }

  scrollForward() {
    const {imagesAmount} = this;
    let {currentIndex: index} = this;

    index++;
    if (index > imagesAmount - 1) index = 0;

    this.scrollTo(index);
  }

  scrollTo(index) {
    this.currentIndex = index;
    this.updateGallery();
  }
}

class ImageGalleryFigure {
  constructor($image) {
    this.$image = $image;
  }

  get $figure() {
    return $(document.createElement('figure'))
      .append(this.$figimage)
      .append(this.$figcaption)
      .css({
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'overflow': 'hidden',
        'width': '100%',
        'height': '100%',
      });
  }

  get $figimage() {
    return this.$image.css({
      'display': 'block',
      'max-width': '100%',
      'max-height': '100%',
    });
  }

  get $figcaption() {
    const caption = this.$image.data('caption');
    if (caption === null) return null;

    const $figcaptionContent = $(document.createElement('div'))
      .html(caption)
      .css({
        'display': 'inline-block',
        'min-height': '100px',
        'padding': '10px 0',
        'text-align': 'center',
      });

    return $(document.createElement('figcaption'))
      .html($figcaptionContent)
      .css({
        'position': 'absolute',
        'bottom': 0,
        'display': 'flex',
        'justify-content': 'center',
        'width': '100%',
        'background-color': 'rgba(0, 0, 0, 0.8)',
        'color': '#ffffff',
      });
  }
}

class ImageGalleryNavigation {
  constructor() {
    return $(document.createElement('nav'))
      .append(this.$scrollPrevBtn)
      .append(this.$scrollNextBtn);
  }

  get $scrollPrevBtn() {
    return $(document.createElement('button'))
      .addClass('scroll scroll-prev')
      .html('&#xea40;')
      .css(this.scrollBtnStyle)
      .css('left', 0);
  }

  get $scrollNextBtn() {
    return $(document.createElement('button'))
      .addClass('scroll scroll-next')
      .html('&#xea3c;')
      .css(this.scrollBtnStyle)
      .css('right', 0)
  }

  get scrollBtnStyle() {
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
      'color': 'white',
    };
  }
}

class WorksGallery {
  constructor($gallery) {
    this.$gallery = $gallery;
    this.$imagesContainer = $gallery.children('.works_images-container');
    this.$images = $gallery.find('.works_image');
    this.isCollapsed = true;

    this.setContainerHeight(0);
    this.setUpEventListeners();
  }

  setUpEventListeners() {
    this.$gallery.on('click', this.toggleButtonHandler.bind(this));
    this.$imagesContainer.on('click', this.openGalleryViewerHandler.bind(this));
    $(window).on('resize', this.pageResizeHandler.bind(this));
  }

  pageResizeHandler() {
    this.setContainerHeight(0);
  }

  openGalleryViewerHandler(e) {
    const $target = $(e.target);

    if (!($target.is('figcaption')
      || $target.is('.works_image'))) return;

    const $clickedFigure = $target.closest('.works_figure');
    if ($clickedFigure.length) {
      const $clickedImage = $clickedFigure.find('.works_image');
      const images = new WorksGalleryImages(this.$gallery);
      new ModalGalleryViewer(images, $clickedImage);
    }
  }

  //*********** Toggle Button Methods ***********//

  toggleButtonHandler(e) {
    const $target = $(e.target);

    const $toggleButton = $target.closest('.gallery-collapse-toggle');
    if ($toggleButton.length) this.toggleCollapse($toggleButton);
  }

  toggleCollapse($toggleButton) {
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      $toggleButton.text('Load more');
    } else {
      $toggleButton.text('Hide');
    }

    this.setContainerHeight(300);
  }

  setContainerHeight(animationDuration = 0) {
    const {isCollapsed, $imagesContainer} = this;

    if (isCollapsed) {
      const imageHeight = this.$images.height();
      $imagesContainer.animate({
        'max-height': imageHeight * 2
      }, animationDuration);
    } else {
      $imagesContainer.animate({
        'max-height': $imagesContainer.get(0).scrollHeight
      }, animationDuration);
    }
  }
}

class WorksGalleryImages {
  constructor($gallery) {
    this.$gallery = $gallery;
    this.setPreviewsImages();
  }

  setPreviewsImages() {
    this.$previews = this.$gallery.find('.works_image');

    return this;
  }

  getFullSizeImage($image) {
    const index = this.getImageIndex($image);
    const link = `files/img/image_${index + 1}.jpg`;

    let caption = this.$previews.eq(index)
      .siblings('.works_caption').html();
    if (caption === undefined) caption = null;

    return $(document.createElement('img'))
      .attr('src', link)
      .data('caption', caption);
  }

  getImageIndex($image) {
    const {$previews} = this;

    for (let i = 0; i < $previews.length; i++) {
      if ($image.is($previews.eq(i))) return i;
    }
  }

  getImageByIndex(index, type = 'full') {
    if (type === 'full') return this.getFullSizeImage(this.$previews.eq(index));
    else if (type === 'preview') return this.$previews.eq(index);
  }
}

const isAnchorLink = $el => {
  const $linkEl = $el.closest('a');
  if (!$linkEl.length) return false;
  const href = $linkEl.attr('href');
  if (!href) return false;
  return href[0] === '#' && href.length > 1;
};

const isPlaceholderLink = $el => {
  const $linkEl = $el.closest('a');
  if (!$linkEl.length) return false;
  const href = $linkEl.attr('href');
  if (!href) return false;
  return href.length === 1 && href[0] === '#';
};

const setUpCarousels = () => {
  $('.home_carousel').owlCarousel({
    items: 1,
    loop: true,
    dotsClass: 'home_dots',
    dotClass: 'home_dot',
  });

  $('.testimonials_carousel').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    navContainerClass: 'testimonials_nav',
    navText: [
      '<img src="files/assets/arrow_prev.png" class="testimonials_prev" alt="Previous">',
      '<img src="files/assets/arrow_next.png" class="testimonials_next" alt="Next">'
    ],
    dotsClass: 'testimonials_dots',
    dotClass: 'testimonials_dot',
  }).trigger('to.owl.carousel', 2);
};

const startVideo = $videoContainer => {
  $videoContainer
    .css('background-color', '#1b1b1b')
    .find('.start-playing')
    .hide(300);

  $videoContainer
    .find('video')
    .show(300)
    .get(0).play();
};

class EventListeners {
  constructor() {
    this.$page = $('body');

    this.$page.on('click', this.preventPlaceholderScroll);
    $('.video-container').on('click', this.videoPlayHandler);
    $('form').on({
      'change': this.inputFocusoutHandler,
      'focusout': this.inputInvalidHandler,
    });
  }

  preventPlaceholderScroll(e) {
    const $link = $(e.target);

    if (isPlaceholderLink($link)) e.preventDefault();
  }

  videoPlayHandler(e) {
    const $target = $(e.target);

    if (!$target.closest('.start-playing').length) return;

    const $container = $(e.currentTarget);
    startVideo($container);
    $container.off('click', startVideo);
  }

  inputFocusoutHandler(e) {
    const $target = $(e.target);
    if (!'INPUT, TEXTAREA'.includes($target.prop('tagName'))) return;

    const $label = $target.next('.label-placeholder');

    if (!$label.length) return;

    if (!$target.val()) {
      $label.removeClass('is-removed');
      return;
    }

    if ($label.hasClass('label-placeholder')) $label.addClass('is-removed');
  }

  inputInvalidHandler(e) {
    const $target = $(e.target);
    const $invalidMessage = $target.siblings('.invalid-message');

    if ($target.is(':invalid')) $invalidMessage.slideDown(300);
    else $invalidMessage.slideUp(300);
  }
}

const pageNavigation = {
  isCollapsed: true,
  $pageNavigation: $('.page-nav'),
  $button: $('.page-nav_toggle'),

  toggleListener() {
    this.$button.on('click', this.toggle.bind(this));

    return this;
  },

  toggle() {
    const {$pageNavigation, $button} = this;
    const isCollapsed = this.isCollapsed = !this.isCollapsed;

    if (isCollapsed) {
      $pageNavigation.removeClass('is-expand');
      $button
        .removeClass('is-cross')
        .addClass('is-menu');
    } else {
      $pageNavigation.addClass('is-expand');
      $button
        .removeClass('is-menu')
        .addClass('is-cross');
    }
  },

  anchorLinkListener() {
    this.$pageNavigation.on('click', e => {
      const $target = $(e.target);
      if (!isAnchorLink($target)) return;

      $('html').add('body').animate({
        scrollTop: $($target.attr('href')).offset().top
      }, 400, 'swing');
      if (window.innerWidth <= 1024) {
        this.toggle();
      }
    });

    return this;
  },
};

$(() => {
  $('body').css('overflow', 'auto');
  $('.preloader').fadeOut(300);

  setUpCarousels();
  autosize($('.textarea-autosize'));

  pageNavigation
    .toggleListener()
    .anchorLinkListener();

  new EventListeners();
  new WorksGallery($('#works_gallery'));
});