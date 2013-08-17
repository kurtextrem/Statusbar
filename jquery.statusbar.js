/**
 * Google alike statusbar.
 *
 * @author 	Jacob Groß (kurtextrem)
 * @date   	2013-08-18
 * @version 	0.3
 */
!function($) {
	"use strict"
	/*
	You can call it with
	.statusbar('Text', {'name': ['#', true]}, {options: true}, function(){})
	.statusbar('Text', {options: true}, function(){})
	.statusbar({options: true}, function(){})
	 */
	$.fn.statusbar = function(text, urls, options, callback){
		if ($.isFunction(options)) {
			if (callback)
				return console.error("Not a valid call. Syntax: ('Text', {'name': ['url', true]}, function(){}) or ('Text', {options: true}, function(){})")
			callback = options
			options = urls
			urls = undefined
		}
		if (typeof text === 'object') {
			if (callback || options)
				return console.error("Not a valid call. Syntax: ('Text', {'name': ['url', true]}, function(){})")
			callback = url
			options = text
			text = undefined
			urls = undefined
		}
		if (!options) {
			var options = {
				text: text,
				urls: urls,
				callback: callback
			}
		} else {
			options.text = text
			options.urls = urls
			options.callback = callback
		}
		var settings = {
			text: '',
			normalText: '',
			urls: {},
			delay: 10000,
			position: 'top',
			center: true,
			html: false,
			timerIn: 'fast',
			timerOut: 'fast',
			closeButton: true,
			callback: function(status, $container, event) {}
		}
		$.extend(settings, options)

		// main elements
		var $container = $('<div class="msg__container">'),
		$inner = $('<div class="msg__inner">'),
		$text = $('<div class="msg__text">')

		if (settings.html)
			$text.html(settings.text)
		else
			$text.text(settings.text)
		if (typeof settings.urls === 'object')
			$.each(settings.urls, function(i, elem){
				var $a = $('<a>')
				if (settings.html)
					$a.html(i)
				else
					$a.text(i)
				var href = elem
				if ($.isArray(elem))
					href = elem[0]
				$a.attr('href', href)
				if (elem[1])
					$a.attr('target', '_blank')
				$text.append($a)
				$a.click(function(e) {
					settings.callback('link', $a, e)
				})
			})
		if (settings.center)
			$container.addClass('msg__center')

		switch (settings.position) {
			case 'top':
				settings.position = 'msg__top'
				break
			case 'bottom':
				settings.position = 'msg__bottom'
				break
			case 'left':
				settings.position = 'msg__left'
				break
			case 'right':
				settings.position = 'msg__right'
				break
			default:
				settings.position = 'msg__top'
				break
		}
		$container.addClass(settings.position)

		$text.append('<span>'+settings.normalText+'</span>')
		$inner.append($text)
		$container.append($inner)
		$container.hide()
		if (settings.closeButton) {
			$container.addClass('msg__closeable')
			var $close = $('<span class="msg__close-button">')
			$inner.append($close)
			$close.click(function(e) {
				$container.fadeOut(settings.timerOut)
				settings.callback('closed', $container, e)
			})

		}
		this.prepend($container)
		$container.fadeIn(settings.timerIn)

		if (settings.delay)
			window.setTimeout(function(){
				$container.fadeOut(settings.timerOut)
				settings.callback('closed', $container)
			}, settings.delay)
		return settings.callback('added', $container)
	}
}(jQuery)