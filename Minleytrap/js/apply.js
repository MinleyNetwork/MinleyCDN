$(document).ready(function() {
	cbApply = new Clipboard( '.cpApply' );

	cbApply.on( 'success', function ( e ) {

		console.log( e );
		swal('Kopiert!', 'Unsere E-Mail Adresse befindet sich nun in deiner Zwischenablage.', 'success');
	} );
});