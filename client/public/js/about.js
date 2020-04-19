//FUNCTION FOR THE FADE ON TEXT REFERENCING QUOTES
(function() {

    var quotes = $(".quotes");
    var quoteIndex = -1;
    
    function showNextQuote() {
        ++quoteIndex;
        quotes.eq(quoteIndex % quotes.length)
            .fadeIn(2000)
            .delay(2000)
            .fadeOut(2000, showNextQuote);
    }
    
    showNextQuote();
    
})();

//VARIABLE THAT SHOWS FUTURE STATUS OF PLAYER
var isThemePlaying = false;

//VARIABLE THAT SHOWS TEXT FOR CURRENT PLAYER STATUS ON/OFF
sound.innerHTML = "4. Sound Is Currently ON";

//FUNCTION THAT LISTENS FOR SPECIFIC KEYCODES 1 + 2 + 3 + 4 AND SPACE
//FUNCTION ALSO PLAYS AND PAUSES AUDIO AS WELL AS UPDATES TEXT FOR CHOICE 4 
document.body.addEventListener("keydown", function (event) {
    
    //KEYCODE FOR THE NUMBER ONE
    if (event.keyCode === 49) {
        window.location.replace("http://localhost:1337/setup.html");
    }
    
    //KEYCODE FOR THE NUMBER TWO
    /*else if (event.keyCode === 50) {
        window.location.replace("TOO SOON");
    }*/
    
    //KEYCODE FOR THE NUMBER THREE
    else if (event.keyCode === 51) {
        window.location.replace("http://localhost:1337/topten.html");
    }
    
    //KEYCODE FOR THE NUMBER FOUR
    else if (event.keyCode === 52) {
		isThemePlaying = !isThemePlaying; 
        
        if(isThemePlaying){
			theme.pause();
			sound.innerHTML = "4. Sound Is Currently OFF";
		}		
        
        else{
			theme.play();
			sound.innerHTML = "4. Sound Is Currently ON";
		}
    }
    
    //KEYCODE FOR THE SPACEBAR
    else if (event.keyCode === 32) {
        window.location.replace("http://localhost:1337/");
    }
});
