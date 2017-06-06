$('button.reason, a.reason').click(function() {
	var action = $(this).attr('action');
	var uuid = $(this).attr('uuid');
	var rule = $(this).attr('rule');
	var reporter = $(this).attr('reporter');

	switch (action) {

		case 'ok':

			var submit = {action: action, uuid: uuid, rule: rule, reporter: reporter};

			$.ajax( {
				url: '/page/php/adminActions.php',
				type: 'POST',
				data: submit,
				success: function ( data, textStatus, jqXHR ) {

					console.log( textStatus );
					window.location.reload();
				},
				error: function ( data, textStatus, errorThrown ) {
					sweetAlert( "Sorry!", data["responseText"], "error" ); //msg : data["responseText"] title : "Error!"
					console.log( data );
				}
			} );
			console.log({action: action, uuid: uuid, rule: rule, reporter: reporter});
			break;

		case 'ban':

			var reason = $(this).attr('reason');

			var submit = {action: action, uuid: uuid, rule: rule, reporter: reporter, reason: reason}

			$.ajax( {
				url: '/page/php/adminActions.php',
				type: 'POST',
				data: submit,
				success: function ( data, textStatus, jqXHR ) {

					console.log( textStatus );
					window.location.reload();
				},
				error: function ( data, textStatus, errorThrown ) {
					sweetAlert( "Sorry!", data["responseText"], "error" ); //msg : data["responseText"] title : "Error!"
					console.log( data );
				}
			} );
			console.log({action: action, uuid: uuid, rule: rule, reporter: reporter, reason: reason});
			break;

		case 'unban':

			var texture = $( this ).attr('texture');
			var id = $( this ).attr('id');
			var submit = {action: action, texture: texture, id: id}

			$.ajax( {
				url: '/page/php/adminActions.php',
				type: 'POST',
				data: submit,
				success: function ( data, textStatus, jqXHR ) {

					console.log( textStatus );
					window.location.reload();
				},
				error: function ( data, textStatus, errorThrown ) {
					sweetAlert( "Sorry!", data["responseText"], "error" ); //msg : data["responseText"] title : "Error!"
					console.log( data );
				}
			} );
			break;
	}
});

($(function() {

}));