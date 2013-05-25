;(function( window, document ) {
	window.DIURNAL = window.DIURNAL || {};

	DIURNAL.init = function() {

		// Initialize Utility and Common functions
		DIURNAL.util.init();
		DIURNAL.common.init();

		// Add "data-page" to body tag to trigger page-specific function
		var page = document.body.getAttribute( "data-page" );

		if (DIURNAL[page] && typeof DIURNAL[page]["init"] === "function") {
			DIURNAL[page]["init"]();
		}
	};

	/*
	 * Utility/Helper
	 */
	DIURNAL.util = {
		init: function() {
			var _this = this;
		}
	};

	/*
	 * Common/Site-Wide
	 */
	DIURNAL.common = {
		init: function() {
			var _this = this;
			$('.parallax-bg').dParallax(2);
		}
	};

	/*
	 * Page-Specific
	 */
	DIURNAL.home = {
		init: function() {
			var _this = this;
		}
	};

	DIURNAL.init();
})( window, document );