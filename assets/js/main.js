;(function( window, document ) {
	window.SITENAME = window.SITENAME || {};

	SITENAME.init = function() {

		// Initialize Utility and Common functions
		SITENAME.util.init();
		SITENAME.common.init();

		// Add "data-page" to body tag to trigger page-specific function
		var page = document.body.getAttribute( "data-page" );

		if (SITENAME[page] && typeof SITENAME[page]["init"] === "function") {
			SITENAME[page]["init"]();
		}
	};

	/*
	 * Utility/Helper
	 */
	SITENAME.util = {
		init: function() {
			var _this = this;
		}
	};

	/*
	 * Common/Site-Wide
	 */
	SITENAME.common = {
		init: function() {
			var _this = this;

		}
	};

	/*
	 * Page-Specific
	 */
	SITENAME.home = {
		init: function() {
			var _this = this;
		}
	};

	SITENAME.init();
})( window, document );