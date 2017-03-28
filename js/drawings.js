function update(faces){
	$('#my_results').html("");
	$('#my_results').append("<span>" + JSON.stringify(faces) + "</span><br />");
}
