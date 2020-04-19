//'LISTENS' FOR THE SPACEBAR AND WHEN PRESSED RETURNS US TO MAIN MENU
document.body.addEventListener("keydown", function (event) {
    
    if (event.keyCode === 81) {
        window.location.replace("http://localhost:1337/mainMenu.html");
    }

});