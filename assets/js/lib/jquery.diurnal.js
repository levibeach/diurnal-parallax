/*
* 
* Diurnal Parallax
*
* Author: Levi Beach (http://levibeach.com)
* Updated: Tues May 14 20:53:00 2013 -0500
* 
*/

(function( $ ){

	$.fn.dParallax = function( speed, options ) {

		// Setup options
		var s = speed || 15,
			settings = $.extend({
				// Not sure I need these...
			}, options);

		return this.each(function(){

			// Store the object
			var $this = $(this);

			var setBg = function() {
				$this.css({
					'background-image':'url('+$this.data('bg-image')+')',
					'background-size':'cover',
					'-webkit-background-size':'cover',
					'-moz-background-size':'cover',
					'-o-background-size':'cover',
					'background-repeat':'no-repeat',
					'background-position':' 50% 50%',
					'background-attachment':'fixed'
				});
			};
			var plax = function() {
				var offset = $this.offset();
				var thisOffset = ((offset.top - $(window).scrollTop()) / (($this.data('parallax-speed')) ? $this.data('parallax-speed') : s));
				$this.css({
					'background-position': 'center ' + (thisOffset) + 'px'
				});
			};

			// Call once to set.
			setBg();
			plax();

			// Call on scroll
			$(window).scroll(plax);
			$(window).resize(plax);
		});

	};

})( jQuery );