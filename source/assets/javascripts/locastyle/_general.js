var locastyle = locastyle || {};
locastyle.general = (function() {
  'use strict';

  var events = {
    '[data-toggle-class]|click': _toggleClass,
    '[data-toggle-text]|click': _toggleText,
    '.ls-link-smooth|click': _smoothScroll
  };

  function init() {
    _unbind();
    _autoTrigger();
    _loadEvents();
    _elementDisabled();
    _linkPreventDefault();
    _btnGroupActivationToogle();
    _menuAnchor();
    _toggleFields();
    subMenu();
    _ariaMenu();
  }

  jQuery.fn.toggleAttr = function(attr) {
    return this.each(function() {
      var $this = $(this);
      return $this.attr(attr) ? $this.removeAttr(attr) : $this.attr(attr, attr);
    });
  };

  function _loadEvents() {
    $.each(events, function(eventDesc, fn) {
      var selectorEvent = eventDesc.split('|');
      $(selectorEvent[0]).off(selectorEvent[1], selectorEvent[2]);
      $(selectorEvent[0]).on(selectorEvent[1], selectorEvent[2], function(evt) {
        var $this = $(this);
        fn(evt, $this);
      });
    });
  }

  function _autoTrigger(){
    var hash = window.location.hash.replace("!/#", "");
    if(hash !== ''){
      $('[data-target="' + hash + '"], a[href="' + hash + '"]').trigger('click');
    }
  }

  function _toggleFields(){
    $('[data-ls-fields-enable]').on('click.ls', function(evt) {
      evt.preventDefault();
      var $this = $(this);
      var $container = $($this.data('ls-fields-enable'));
      var isFormText = $container.data('form-text') ? 'ls-form-text' : '';
      $container
        .toggleClass('ls-form-disable ls-active ' + isFormText)
        .find(':input').each(function(indexField, field){
          var $field = $(field);
          $field
            .toggleAttr('disabled')
            .toggleClass(isFormText)
            .val($field.data('original-value'));
        });
    });
  }

  function _menuAnchor() {
    $(".ls-menu .ls-active > a").focus().css('outline', 'none');
  }

  function _toggleClass(evt, $this) {
    var $target = $this.data('target') ? $($this.data('target')) : $this,
        cssClass = $this.data('toggle-class');
    if( /(radio)|(checkbox)/.test($this.attr('type'))  ){
      $target.toggleClass(cssClass, !$this.prop('checked'));
      $('[name="' + $this.attr('name') + '"]').not($this).each(function (evt) {
        var $that = $(this);
        var $target2 = $that.data('target') ? $($that.data('target')) : $that,
        cssClass2 = $that.data('toggle-class');
        $target2.toggleClass(cssClass2, $this.prop('checked'));
      });
    } else {
      evt.preventDefault();
      $target.toggleClass(cssClass);
    }
  }

  function _toggleText(evt, $this) {
    evt.preventDefault();
    var $target      = $this.data('target-text') ? $($this.data('target-text')) : $this,
        textChange   = $this.data('toggle-text'),
        textOriginal = $target.text();
    $this.data('toggle-text', textOriginal);
    $target.text(textChange);
  }

  function _smoothScroll(evt, $this) {
    evt.preventDefault();
    var $target = $($this.attr('href'));
    if ($target[0]) {
      $('html,body').animate({
        scrollTop: $target.offset().top - 70
      }, 1000);
    }
  }

  function subMenu() {
    $('.ls-submenu > a').on('click.ls', function(evt) {
      var $submenu = $(this).parent('.ls-submenu');
      evt.preventDefault();
      $(this).parent().toggleClass('ls-active');
      _ariaSubmenu($submenu);
    });
    if($('.ls-submenu').find('li').hasClass('ls-active')){
      $('.ls-submenu li.ls-active').parents('.ls-submenu').addClass('ls-active');
    }
  }

  function _elementDisabled() {
    $(".ls-disabled, [disabled='disabled']").on('click', function(evt) {
      if( $(this).hasClass('ls-disabled') || $(this).attr('disabled') === 'disabled' ){
        evt.stopImmediatePropagation();
        evt.preventDefault();
        evt.stopPropagation();
        return false;
      }
    });
  }

  function _linkPreventDefault(dom_scope) {
    $("a", dom_scope).on("click.lsPreventDefault", function(e) {
      if ($(this).attr("href") === "" || $(this).attr("href") === "#") {
        e.preventDefault();
      }
    });
  }

  function _btnGroupActivationToogle() {
    $(".ls-group-active [class*='ls-btn']").on("click", function() {
      $(this).siblings().removeClass("ls-active");
      $(this).addClass("ls-active");
    });
  }

  function _unbind () {
    $('[data-ls-fields-enable]').off('click.ls');
    $('.ls-submenu > a').off('click.ls');
    $(".ls-disabled, [disabled='disabled']").off('click');
  }

  function _ariaMenu() {
    var $menu = $('.ls-menu');
    $menu.attr({ role : 'navigation' });
    $menu.find('ul').attr({ role: 'menu' });
    $menu.find('a').attr({ role : 'menuitem' });

    $('.ls-submenu').each(function(i,el){
       _ariaSubmenu(el);
    });
  }

  function _ariaSubmenu(el) {
    if($(el).hasClass('ls-active')){
      $(el).attr({
        'aria-expanded': 'true',
        'aria-hidden' : 'false'
      });
    } else{
      $(el).attr({
        'aria-expanded': 'false',
        'aria-hidden' : 'true'
      });
    }
  }

  return {
    init: init,
    subMenu: subMenu
  };

}());
