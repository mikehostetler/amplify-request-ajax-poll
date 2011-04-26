(function( amplify, $, undefined ) {	

amplify.request.ajaxPollErrors = {
	404: true
};

amplify.request.types[ "ajax-poll" ] = function( resource ) {
	var baseResourceId = "ajax-poll-" + resource.resourceId;
	amplify.request.define( baseResourceId, "ajax", resource );

	return function( settings, request ) {
		var baseRequest, timeout, ampXHR,
			aborted = false,
			abort = request.abort,
			baseSettings = $.extend( {}, settings, {
				resourceId: baseResourceId,
				success: function() {
					settings.success.apply( this, arguments );
					poll();
				},
				error: function( data, ampXHR ) {
					settings.error.apply( this, arguments );
					if ( !ampXHR || !( ampXHR.status in amplify.request.ajaxPollErrors ) ) {
						poll();
					}
				}
			});

		function poll() {
			if ( aborted ) {
				return;
			}

			timeout = setTimeout(function() {
				baseRequest = amplify.request( baseSettings );
			}, resource.frequency );
		}

		baseRequest = amplify.request( baseSettings );
		request.abort = function() {
			aborted = true;
			clearTimeout( timeout );
			baseRequest.abort();
			abort.call( this );
		};
	};
};

}( amplify, jQuery ));
