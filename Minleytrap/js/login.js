function openLogin() {
	$( "#header .navbar" ).toggleClass( "login" );
	$( "html, body" ).animate( {scrollTop: 0}, "slow" );
	$( '.logincontainer' ).animate( {
		height: "toggle",
		opacity: "toggle"
	}, "slow" );
	$( '#mcuser' ).focus();
}

$( '#loginform' ).click( function ( event ) {
	openLogin();
} );

if(window.location.hash == "#login") {
	if ($( "#userbtn" ).length) {
		window.location.replace("/control");
	} else {
		openLogin();
	}
}

var getKeyModal = $( '[data-remodal-id=getKeyModal]' ).remodal();

$( '#getKeyBtn, .loginform .fa-info-circle' ).click( function ( event ) {
	event.preventDefault();
	getKeyModal.open();
} );

$( "#getKeyDesc input[type='text']" ).on( "click", function () {
	$( this ).select();
} );

$( "#getKeyDesc input[type='text']" ).contextmenu( function () {
	$( this ).select();
} );




$( '.loginform' ).submit( function ( e ) {
	e.preventDefault();

	$(this).addClass("loading");

	$.getJSON( '/?' + $(this).serialize(), function ( data ) {

		if ( data.msg != '' ) {
			$('.loginform').removeClass("loading");
			sweetAlert( {
				title: "Oops...",
				text: data.msg,
				type: "error",
				html: true
			});
		} else {
			window.location.replace(data.url);
		}
	} );
} );