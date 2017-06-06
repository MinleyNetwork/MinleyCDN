/*

    __        __        __  ___        __
   / /  ___ _/ /  __ __/  |/  /__  ___/ /
  / /__/ _ `/ _ \/ // / /|_/ / _ \/ _  /
 /____/\_,_/_.__/\_, /_/  /_/\___/\_,_/
                /___/

 copyright © 2016, LabyMedia UG (haftungsbeschränkt)
*/

/**
 * Generate an instance
 * of the copy clipboard tool
 */
cb = new Clipboard( '.cp' );

cb.on( 'success', function ( e ) {

	console.log( e );

	if ( Notification.permission !== "granted" ) {

		Notification.requestPermission();
	} else {
		var options = {
			body: "Copied!",
			icon: "page/tpl/assets/images/logo_web.png"
		}

		var notification = new Notification( "LabyMod Adminpanel", options );

		notification.onclick = function () {

			var panel = window.open( "#", "_self" );
			panel.focus();
			notification.close();

			return false;
		};
	}
} );

cb.on( 'error', function ( e ) {

	console.log( e );
	swal( "Error!", "Konnte nicht kopiert werden.", "error" );
} );

/**
 * Random Comics
 */
$( function () {

	$( 'img.comic' ).attr( 'src', getSource( 1, 1993 ) );
} );

function getSource( min, max ) {

	var rdm = Math.round( Math.random() * (max - min) + min );

	if ( rdm < 10 ) {

		rdm = '000' + rdm;
	} else if ( rdm < 100 ) {

		rdm = '00' + rdm;
	} else if ( rdm < 1000 ) {

		rdm = '0' + rdm;
	}

	return 'http://ruthe.de/cartoons/strip_' + rdm + '.jpg';
}

/**
 * Admin Functions
 */
$( '.admin-action' ).click( function () {

	var action = $( this ).attr( 'action' );
	var AdminModal = $( '[data-remodal-id=AdminModal]' ).remodal();

	switch ( action ) {

		case 'addCosmetic':
			AdminModal.open();
			break;

		case 'confirmAddCosmetic':
			var cosmetic_id = $( '#cosmetic_id' ).find( ':selected' ).attr( 'cosid' );
			var dataVar = $( '#cosmetic_id' ).find( ':selected' ).attr( 'data' );

			// Formdata
			var user_id = $( 'input#user_id' ).val();
			var cosid = $( '#cosmetic_id' ).find( ':selected' ).attr( 'cosid' );
			var data = '';
			var enabled = $( '.toggleCos.active input' ).val();
			var expire = $( '#expire' ).val();
			var comment = $( 'select#reason' ).find(':selected').val();

			if ( dataVar != '' ) {
				switch ( dataVar ) {
					case 'cape':
						data = $( '.data-cape.active input' ).val();
						break;

					case 'rgb':
						data = hexToRgb( $( 'input#data-rgb' ).val() );
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
						break;

					case 'country':
						data = $( 'select#data-country' ).find( ':selected' ).val();
						break;

					case 'animation':
						data = $( '.data-animation.active input' ).val();
						break;

					case 'string':
						data = $( 'input#data-string' ).val();
						break;

					case 'halloween':
						data = $( 'select#data-halloween' ).find( ':selected' ).val();
						break;

					default:
						data = '';
				}
			}


			var stmt = {
				action: 'addCosmetic',
				user_id: user_id,
				cosmetic_id: cosid,
				data: data,
				enabled: enabled,
				expire: expire,
				comment: comment
			}
			console.log(stmt);
			$.post( 'page/php/adminActions.php', stmt, function ( data ) {

				if (data == 'success') {
					swal( {
							title: "Hinzugefügt!",
							text: 'Der User hat das Cosmetic erfolgreich erhalten',
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
				} else {
					sweetAlert( "Sorry!", data, "error" );
				}
			} );
			break;

		case 'editCosmetic':
			var stmt = {
				'action': 'editCosmetic',
				'id': $( this ).attr( 'cosId' )
			}

			$.post( '/page/php/admin.php', stmt );
			break;

		case 'deleteCosmetic':

			var a = 'deleteCosmetic';
			var b = $( this ).attr( 'cosId' );
			var c = $( this ).attr( 'targetUuid' );
			swal( {
					title: "Bist du sicher?",
					text: "Dieser Schritt kann NICHT rückgangig gemacht werden!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ja",
					cancelButtonText: "Nein",
					closeOnConfirm: false,
					closeOnCancel: true
				},
				function ( isConfirm ) {
					if ( isConfirm ) {
						$.ajax( {
							url: '/page/php/adminActions.php',
							type: 'POST',
							data: {action: a, id: b, target: c},
							success: function ( data, textStatus, jqXHR ) {
								console.log( data );
								swal( {
										title: "Gelöscht!",
										text: data["responseText"],
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
								sweetAlert( "Sorry!", data["responseText"], "error" ); //msg : data["responseText"] title : "Error!"
								console.log( data );
								// STOP LOADING SPINNER
							}
						} );
					}
				} );
			break;

		case 'newPromoCode':
			AdminModal.open();
			break;

		case 'moveCosmetic':

			cosId = $( this ).attr( 'cosId' );
			holderName = $( this ).attr( 'holderName' );
			holderUuid = $( this ).attr( 'holderUuid' );

			swal( {
				title: 'Cosmetic verschieben',
				type: 'input',
				text: 'Spieler welcher das Cosmetic erhalten soll:',
				inputPlaceholder: 'IGN / UUID',
				closeOnConfirm: false,
				showCancelButton: true
			},
			function ( inputValue ) {

				if ( inputValue === false ) {

					return false;
				} else if ( inputValue === '' ) {
					swal.showInputError( 'Bitte gib einen Nutzernamen ein!' );

					return false
				} else if ( inputValue.length > 16 && !(inputValue.length == 32 || inputValue.length == 36) ) {
					swal.showInputError( 'Ungültiger Nutzername' );

					return false
				}

				$.ajax( {
					method: 'POST',
					url: '/page/php/adminActions.php',
					data: {
						action: action,
						user: inputValue,
						cosId: cosId,
						holderName: holderName,
						holderUuid: holderUuid
					},
					success: function( data, textStatus, jqXHR ) {

						swal( {
							type: 'success',
							title: 'Success',
							text: data
						},
						function() {
							window.location.reload();
						} );
					},
					error: function( data, textStatus, errorThrown ) {

						swal.showInputError( data['responseText'] );
					}
				} );
			} );
			break;

		case 'editCape':
			var $elem = $( this );
			var cosId = $elem.attr( 'cosId' );
			var data = $elem.attr( 'data' );
			var holderUuid = $elem.attr( 'holderUuid' );

			$.ajax( {
				method: 'POST',
				url: '/page/php/adminActions.php',
				data: {
					action: action,
					cosId: cosId,
					data: data,
					holderUuid: holderUuid
				},
				success: function( data, textStatus, jqXHR ) {

					console.log( data );
					console.log( textStatus );
					console.log( jqXHR );
					swal( {
						type: 'success',
						title: 'Success',
						text: data
					},
					function () {
						window.location.reload();
					} );
				},
				error: function( data, textStatus, errorThrown ) {

					swal( {
						type: 'error',
						title: 'Whoops!',
						text: data['responseText']
					} );
				}
			} );
	}
} )

/**
 * Datepicker
 */
$( function () {

	$( ".datepicker" ).datepicker();
} );

/**
 * searchUser
 */
var switcher = 0;
$( 'form#searchUser' ).submit( function ( e ) {

	if ( switcher == 0){
		e.preventDefault();

		$.ajax( {
			url: '',
			method: 'POST',
			data: $( this ).serialize(),
			success: function( data, textStatus, jqXHR ) {

				switcher = 1;
				$( 'form#searchUser' ).submit();
			},
			error: function( data, textStatus, errorThrown ) {

				switcher = 0;
				swal( {
					type: 'error',
					title: 'Whoops!',
					text: data['responseText']
				} );
			}
		} );
	}
} );

/**
 * User Information Panel
 */
$( 'a.adminLink' ).click( function () {

	var UserInfo = $( '[data-remodal-id=UserInfo]' ).remodal();
	UserInfo.open();
} );

$( 'button.userFriends' ).click( function() {

	var userFriends = $( '[data-remodal-id=UserFriends]' ).remodal();
	userFriends.open();
} );

/**
 * Adminmodal Changelistener
 */
$( '.change-listener' ).change( function () {

	var data = $( this ).find( ':selected' ).attr( 'data' );
	var target = $( '.cosData' );

	target.addClass( 'hidden' );

	switch ( data ) {

		case 'rgb':
			$( '.data-color' ).removeClass( 'hidden' );
			break;

		case 'cape':
			$( '.data-cape' ).removeClass( 'hidden' );
			break;

		case 'string':
			$( '.data-string' ).removeClass( 'hidden' );
			break;

		case 'animation':
			$( '.data-animation' ).removeClass( 'hidden' );
			break;

		case 'country':
			$( '.data-countries' ).removeClass( 'hidden' );
			break;

		case 'halloween':
			$( '.data-halloween' ).removeClass( 'hidden' );
			break;

		default:
			target.addClass( 'hidden' );
	}
} );


/**
 * Disable colorpicker access
 */
$( '.wings' ).spectrum( {
	disabled: true
} );

/**
 * SU - SOS function to switch to the user
 */
$( '.su-listener' ).on('click', function ( e ) {
	$.ajax( {
		url: '/page/php/adminActions.php',
		type: 'POST',
		data: {
			action: 'switchUser',
			uuid: $( this ).attr('uuid'),
			username: $( this ).attr('username')
		},
		success: function ( data, textStatus, jqXHR ) {
			window.location.replace('/control');
			console.log( data );
		},
		error: function ( data, textStatus, errorThrown ) {
			// Handle errors here
			sweetAlert( "Sorry!", data["responseText"], "error" ); //msg : data["responseText"] title : "Error!"
			console.log( data );
			// STOP LOADING SPINNER
		}
	} );
});

/**
 * Poll service
 */
$( 'a.clickAddIdea' ).click( function () {

	var addIdea = $( '[data-remodal-id=addIdea]' ).remodal();
	addIdea.open();
} );

$( 'button.sendIdea' ).click( function () {
	$( 'form#addCosIdea' ).submit();
} );

$( 'form#addCosIdea' ).submit( function ( e ) {

	e.preventDefault();
	var $username = $( 'input[name=username]' ).val();
	var $cosname = $( 'input[name=cosname]' ).val();
	var $description = $( 'textarea[name=description]' ).val();

	$.ajax( {
		url: '/page/php/poll.php',
		method: 'POST',
		data: {
			action: 'addCosIdea',
			username: $username,
			cosname: $cosname,
			description: $description
		},
		success: function ( data ) {
			data = JSON.parse( data );
			swal( {
				type: 'success',
				title: 'Thx!',
				text: data.text
			}, function () {
				window.location = '/poll';
			} );
		},
		error: function ( data ) {
			data = JSON.parse( data.responseText );
			swal( {
				type: 'error',
				title: 'Whoops!',
				text: data.text
			} );
		}
	} );
} );