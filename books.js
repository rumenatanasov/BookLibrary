const kinveyAppId = "kid_rJ1vX9kq";
const kinveyAppSecret = "0fddf7e13a36457c86838a141acfde5c";
const kinveyBaseUrl = "https://baas.kinvey.com/";


function showView(viewID) {
    $('main>section').hide();
    $('#' + viewID).show();
}
function hideNavigationLinks() {
    let loggedIn = sessionStorage.authToken != null;
    if(loggedIn){
        $('#linkCreateBook').show();
        $('#linkRegister').hide();
        $('#linkListBooks').show();
        $('#linkLogout').show();
        $('#linkLogin').hide();
    }else{
        $('#linkLogin').show();
        $('#linkLogout').hide();
        $('#linkListBooks').hide();
        $('#linkRegister').show();
        $('#linkCreateBook').hide();
    }
}
function showLoginView() {
    showView('viewLogin');
}

function showRegisterView() {
    showView('viewRegister');
}

function showHomeView() {
    showView('viewHome');
   
}
function login() {
    let authBase64 = btoa(kinveyAppId + ":" + kinveyAppSecret);
    let loginURL = kinveyBaseUrl + "user/" + kinveyAppId + "/login";
    $.ajax({
        method: "POST",
        url: loginURL,
        crossDomain:true,
        data:{
            username: $('#loginUser').val(),
            password: $('#loginPass').val()
        },
        headers: {"Authorization": "Basic " + authBase64},
        success: loginSuccess,
        error: showError
    });
    function loginSuccess(data, status) {
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooks();
        hideNavigationLinks();
        showInfo('Login successful');
    }

}
function register() {
    let authBase64 = btoa(kinveyAppId + ":" + kinveyAppSecret);
    let regUrl = kinveyBaseUrl + "user/" + kinveyAppId + "/";
    let regData = {
        username: $('#registerUser').val(),
        password: $('#registerPass').val()
    };
    $.ajax({
        method:"POST",
        url:regUrl,
        data:regData,

        headers: { "Authorization":"Basic " + authBase64},
        success: registerSuccess,
        error: showError
    });
    function registerSuccess(data, status) {
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooks();
        hideNavigationLinks();
        showInfo("Register successful");
    }
}
function showInfo(messageText) {
    $('#infoBox').text(messageText).show().delay(3000).fadeOut();
}

function showError(data, status) {
    let errorMsg = "Error" + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();

}

function showListBooks() {
    showView('viewListBooks');

    let listUrl = kinveyBaseUrl + "appdata/" + kinveyAppId + "/books";
    $.ajax({
        method:"GET",
        url:listUrl,
        //crossDomain:true,
        headers:{"Authorization": "Kinvey " + sessionStorage.authToken},
        success:booksLoaded,
        error: showError

    }

    )
    function booksLoaded(books,status) {
        showInfo('Books loaded');
        $('#books').text('');



        let booksTable =$('<div class="panel panel-default">' +
            '<div class="panel panel-heading"></div></div>')
            .append

            ($("<table class='table table-bordered'>").append($('<tr>')

            .append('<td>Title</td><td>Author</td><td>Description</td>')));


        for(let book of books){
            booksTable.append($('<tr>')
                .append($('<td>').text(book.title))
                    .append($('<td>').text(book.author))
                        .append($('<td>').text(book.description)));
        }
        $('#books').append(booksTable);
    };

}


function showCreateBookView() {
    showView('viewCreateBook');
}
function createBook() {
    let booksURL = kinveyBaseUrl + "appdata/" + kinveyAppId + "/books";
    let authHeaders = {
        "Authorization": "Kinvey " + sessionStorage.authToken
    };
    let newBookData = {
        title: $('#bookTitle').val(),
        author: $('#bookAuthor').val(),
        description: $('#bookDescription').val()
    };
    $.ajax({
        method: "POST",
        url: booksURL,
        data: newBookData,
        headers: authHeaders,
        success: bookCreated,
        error: showError
    });
    function bookCreated() {
        showListBooks();
        showInfo('Books created');
    }
}


function logout() {

    showHomeView();
    sessionStorage.clear();
    hideNavigationLinks();
}
$(function () {
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkHome').click(showHomeView);
    $('#linkListBooks').click(showListBooks);
    $('#linkCreateBook').click(showCreateBookView);
    $('#linkLogout').click(logout);

   $('#formLogin').submit(function (e) {event.preventDefault();login()});
    $('#formRegister').submit(function (e) {event.preventDefault(); register()});
    $('#formCreateBook').submit(function (e) {event.preventDefault(); createBook();
        
    })



    showHomeView();
    hideNavigationLinks();

    $(document).ajaxStart(function () {
        $('#loadingBox').show();
    })
    $(document).ajaxStop(function () {
        $('#loadingBox').hide();
    })


})