//'LISTENS' FOR THE SPACEBAR AND WHEN PRESSED TAKES US TO MAIN MENU
document.body.addEventListener("keydown", function (event) {
    
    if (event.keyCode === 32) {
        window.location.replace("http://localhost:1337/mainMenu.html");
    }

});