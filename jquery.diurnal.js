/*
* 
* Diurnal Parallax
*
* Author: Levi Beach (http://levibeach.com)
* Released under the WTFPL license
* Updated: 2013.05.15
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
					'background-repeat':'no-repeat',
					'background-position':' 50% 50%',
					'background-attachment':'fixed'
				});
			};
			var plax = function() {
				var offset = $this.offset();
				var thisOffset = ((offset.top - $(window).scrollTop()) / 15);
				$this.css({
					'background-position': 'center ' + (thisOffset) + 'px'
				});
			};

			// Call once to set.
			setBg();
			plax();

			// Call on scroll
			$(window).scroll(plax);
		});

	};

})( jQuery );