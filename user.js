
document.onreadystatechange = function() {
	user = GetCookie('username');
	if(user == "")
		location.href="../part1/part1.html";
};

var user;
window.onload = function() { 
	$('#user').text(user + '|');
	displayBookmarks();
};

function displayBookmarks() {

    $('#bookmarksUrl').empty();
	$.get('bookmarks.php',
		{'getUserUrls': user},
		function(data) {
			if(data.length == 0)
				$('#bookmarksUrl').append("<h1 id='noBookmarks'> You have no bookmarks :(</h1>");

			for(var i = 0; i < data.length; i++){
				var url = data[i].Url;
				AddUrlToPage(url);
			}
		}, "json");
}

function AddUrlToPage(url) {
	var urlElement = createNewBookmark(url);
	$('#bookmarksUrl').prepend(urlElement);
	if($('#noBookmarks'))
		$('#noBookmarks').remove();
}

function createNewBookmark(url) {
	var newBookmark = "<div class='url' id='" + url + "'>"
	newBookmark += "<a target='_blank' href='" + url + "'>" + url + "</a>";
	newBookmark += "<button type='button' class='btn btn-primary edit'>Edit</button>";
	newBookmark += "<button type='button' class='btn btn-danger delete'>Delete</button>";
	newBookmark += "</div><hr>"
	return newBookmark;
}


$('#logout').click(function() {
    document.cookie = "username=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
	location.href="part1.html";
});


$('#addUrl').click(function() {
	var url = $('#urlInput').prop('value');
	AddNewUrl(url);
});

$('#urlInput').keypress(function (e) {
    var key = e.which;
    if (key == 13)  // the enter key code
    {
        $('#addUrl').click();

        return false;
    }
});   


function AddNewUrl(url) {

    $.post('bookmarks.php',
		{'addUrl': url,
		 'user': user},
		function(data) {
			if(data == false)
				ShowDatabaseError("Unable to add URL. Please ensure it is valid.");
			else if(data == -1)
				ShowDatabaseError("This webpage has already been added to your bookmark!");
			else {
				ShowDatabaseError("");
                AddUrlToPage(url);
                location.reload();
			}
		});
}

function UpdateUrl(url, oldUrl) {
    $.post('bookmarks.php',
		{'updateUrl': url,
		 'user': user,
		 'oldUrl': oldUrl},
		function(data){
			if(data == false)
				ShowDatabaseError("Unable to update URL. Please ensure it is valid.");
			else if(data == -1)
                ShowDatabaseError("This webpage has already been added to your bookmark!");
			else {
				ShowDatabaseError("");
				UpdateEditedLink(url);
			}
		});
}

$(document).on('click', '.delete', function() {
	var url = this.parentNode.getAttribute('id');
    $.post('bookmarks.php',
		{'deleteUrl':url},
		function(data) {
			if(data == false)
				ShowDatabaseError("Unable to delete the url" + url);
			else {
				ShowDatabaseError("");
                displayBookmarks();			
			}
		})
});


var prevUrl;
$(document).on('click', '.edit', function() {
	$(':input').prop('disabled', true);

	var link = this.previousElementSibling;
	link.setAttribute("id", "replaceWithEditableLink");
	var linkUrl = link.getAttribute('href');

	prevUrl = linkUrl;
	var newEdit = "<input id='editableLink' type='text' value='" + linkUrl + "'>";
	newEdit += "<input id='saveUrl' class='btn btn-primary' type='submit' value='SAVE'>";
	newEdit += "<input id='cancelUrl' class='btn btn-danger' type='submit' value='CANCEL'>";
	$("#replaceWithEditableLink").after(newEdit);
	$("#replaceWithEditableLink").remove();
});

function UpdateEditedLink(url) {

	var newBookmark = "<a target='_blank' href='" + url + "'>" + url + "</a>";
	$('#editableLink').before(newBookmark);
	$('#editableLink').remove();
	$('#saveUrl').remove();
	$('#cancelUrl').remove();

	$(':input').prop('disabled', false);
}

$(document).on('click', '#saveUrl', function() {
	UpdateUrl(this.previousElementSibling.value, prevUrl);
});

$(document).on('click', '#cancelUrl', function() {
	UpdateEditedLink(prevUrl);
});

function ShowDatabaseError(msg) {
	$('#error').text(msg);
}


