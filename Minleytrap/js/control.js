function hexToRgb( hex ) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace( shorthandRegex, function ( m, r, g, b ) {
		return r + r + g + g + b + b;
	} );

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
	return result ?
	parseInt( result[1], 16 ) + "," +
	parseInt( result[2], 16 ) + "," +
	parseInt( result[3], 16 )
		: null;
}

$( '#moveBtn' ).click( function () {
	swal( {
			title: "Move Cape",
			text: "When your cape is moved, you'll no longer be the rightful owner of the cape.",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Minecraft Username of the new owner"
		},
		function ( inputValue ) {
			if ( inputValue === false ) return false;
			if ( inputValue === "" ) {
				swal.showInputError( "You need to write something!" );
				return false;
			}

			kt = Math.floor(Date.now() / 1000);

			$.ajax( {
				url: 'page/php/move.php',
				type: 'POST',
				data: {move: inputValue, kt: kt},
				success: function ( data, textStatus, jqXHR ) {
					swal( {
							title: "Success!",
							text: data,
							type: "success",
							allowEscapeKey: false,
							showCancelButton: false,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "Okay",
							closeOnConfirm: false
						},
						function () {
							location.reload();
						} );

				},
				error: function ( data, textStatus, errorThrown ) {
					// Handle errors here
					//sweetAlert( "Sorry!", "This Feature is currently in maintenace.\nWe\'ll bring it back online as fast as possible.", "error" );
					sweetAlert( "Sorry!", data["responseText"], "error" ); //msg : data["responseText"] title : "Error!"
					console.log( data );
					// STOP LOADING SPINNER
				}
			} );
		} );
} );

$( '#uploadBtn' ).click( function () {
	$( '#fileupload' ).click();
} );

var setCapeModal = $( '[data-remodal-id=setCapeModal]' ).remodal();
$( '#setCapeBtn' ).click( function ( event ) {
	event.preventDefault();
	setCapeModal.open();
} );

$( '.capeSlider' ).unslider( {
	speed: 300
} );

/**
 * Switch Visibility
 */
$( '.enabled' ).change( function () {
	if ( this.checked ) {

		var state = 1;
	} else {

		var state = 0;
	}

	var submit = {
		type: 'switch',
		value: state,
		item: $( this ).attr( 'id' ),
		site: 'control'
	}

	$.post( 'page/php/change.php', submit, function ( data ) {

		data = JSON.parse( data );
		console.log( data );
	} );
} );


/**
 * Switch wing color
 */
$( ".colorpicker" ).spectrum( {
	preferredFormat: "hex",
	showInput: true,
	change: function ( color ) {
		$.ajax( {
			method: "POST",
			url: "page/php/change.php",
			data: {type: "wing-color", item: $( this ).attr( "id" ), value: hexToRgb( color.toHexString() ),site: 'control'}
		} ).done( function ( data ) {
			data = JSON.parse( data );
			console.log( data );
		} );
	}
} );

/**
 * Change Hat country
 */
$( '#countrySelect' ).change( function () {

	$( '#countrySelect option:selected' ).each( function () {

		var submit = {
			type: 'hat-country',
			value: $( this ).val(),
			item: $( this ).attr( 'id' ),
			site: 'control'
		}
		$.post( 'page/php/change.php', submit, function ( data ) {
			data = JSON.parse( data );
			console.log( data );
		} );
	} );
} );


/**
 * Change Animation
 */
$( '.emotions' ).change( function () {
	if ( $( 'input[name=emotions]:checked' ).val() == "on" ) {
		var state = "EMOTIONS";
	} else {
		var state = "";
	}

	var submit = {
		type: 'emotions',
		value: state,
		item: $( this ).parent().parent().attr( 'id' ),
		site: 'control'
	}
	$.post( 'page/php/change.php', submit, function ( data ) {
		data = JSON.parse( data );
		console.log( data );
	} );
} );


/**
 * FILEUPLOAD
 */
$( '#fileupload' ).change( function ( event ) {
	event.stopPropagation(); // Stop stuff happening
	event.preventDefault();
	var file_data = $( '#fileupload' ).prop( 'files' )[0];
	console.log( file_data );
	var form_data = new FormData();
	form_data.append( 'file', file_data );
	console.log( form_data );
	$.ajax( {
		url: 'page/php/cape.php',
		type: 'POST',
		data: form_data,
		async: false,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		success: function ( data, textStatus, jqXHR ) {
			swal( {
					title: "Success!",
					text: "Your Custom HD Cape was updated!",
					type: "success",
					allowEscapeKey: false,
					showCancelButton: false,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Okay",
					closeOnConfirm: false
				},
				function () {
					location.reload();
				}
			);
		},
		error: function ( jqXHR, textStatus, errorThrown ) {
			// Handle errors here
			sweetAlert( "Error!", jqXHR["responseText"], "error" );
			console.log( jqXHR );
			// STOP LOADING SPINNER
		}
	} );
} );

$( '.capes' ).perfectScrollbar( {
	wheelSpeed: 0.4
} );

$( ".setCapeRow .capes li" ).attr( "width", "250px" );

$( '.capes li' ).click( function () {
	$( '.capes li' ).removeClass( "active" );
	$( this ).addClass( "active" );
	isRotating = true;
	cape.src = "page/php/getCape.php?c=" + $( this ).attr( "data" );
	if ( $( this ).attr( "data" ) == "10_LABYMOD.png" ) {
		capecanvas.width = 1024;
		capecanvas.height = 512;
	} else {
		capecanvas.width = 64;
		capecanvas.height = 32;
	}

	$( "#skinpreview h3" ).html( $( this ).html() );
} );


// SAVE Cape Template
$( document ).on( 'confirmation', '.setCapeModal', function () {
	$.ajax( {
		method: "POST",
		url: "page/php/setCapeTpl.php",
		data: {cape: $( ".capes li.active" ).attr( "data" )}
	} ).done( function ( msg ) {
		location.reload();
	} );
} );


/**
 * REFRESH COUNTER
 */
$( document ).ready( function () {
	var seconds = new Date().getSeconds();
	seconds -= 40;

	setInterval( function () {
		seconds--;

		if ( seconds < 0 ) {
			seconds = 60 - Math.abs( seconds );
		}
		//console.log( seconds ); // DEBUG
		$( 'b span' ).html( seconds );
	}, 1000 );
} );



// ADVENT
var adventModal = $( '[data-remodal-id=adventModal]' ).remodal();
giftcount = 3;
code = 0;
newcode = true;
nameItem = 0;

$("#adventgift").click(function() {
	
	$.getJSON( "page/php/ostern.php", function( json ) {
			code = json.code;
			newcode = json.newcode;
			nameItem = json.name;
			openAdventModal(nameItem, code);
			if (newcode == false) {
				$(".adventModal").removeClass("closed");
			} else {
				$(".adventRow img").delay(1000).effect( "shake", {times:4}, 700 );
			}
	});
});

$(".adventRow img").click(function() {
	if($(".adventRow .giftarea").css("display") == "none") {
		$(this).effect( "shake", {times:2*giftcount}, 700 );
		zoom = giftcount * 50;
		$(this).animate({
			width: zoom
		}, 1000);
		giftcount++;

		if(giftcount == 6) {
			$(".adventModal").delay(800).removeClass("closed");
		}
	} else {
		$(".adventRow img").css("curser", "default");
	}
});
 

function openAdventModal(nameItem, code) {
	adventModal.open();
	window.location.hash="";
	$(".adventRow h3").html(nameItem);
	$(".adventRow input").val(code);
}

$( ".adventRow input[type='text']" ).on( "click", function () {
	$( this ).select();
} );

$( ".adventRow input[type='text']" ).contextmenu( function () {
	$( this ).select();
} );