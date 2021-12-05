import * as howler from '/howler.js';

const key = document.querySelector(".Key");
const replayKey = document.querySelector(".Replay");
const morseText = document.querySelector(".MorseText");
const textDiv = document.querySelector(".TextDiv");
const buttonTranslate = document.querySelector(".ButtonTranslate");
const buttonPlayTranslation = document.querySelector(".PlayTranslation");
const inputTranslateField = document.querySelector(".InputField");
const translationText = document.querySelector(".Translation");


const array = [];
const arrayDelays = [];
let timeStart;
let timeEnd;
let betweenTimeStart;
let betweenTimeEnd;

const keySound = new Howl({
    src: ["/audio/440.wav"],
    loop: true,
});

// Timing and logging the time between clicks and the length of each click.
key.addEventListener("mousedown", function () {
    replayKey.style.opacity = "100%";
    replayKey.style.transform = "translateY(-10px)";

    //Stores the length between clicks.
    betweenTimeEnd = new Date;
    arrayDelays.push(betweenTimeEnd - betweenTimeStart);

    // Starts timing the length of a click.
    timeStart = new Date();
    keySound.play();

});

// Timing and logging the time between clicks and the length of each click.
key.addEventListener("mouseup", function () {
    keySound.stop();

    // Stores a dot/dash with a timestamp of the length.
    timeEnd = new Date();
    if (timeEnd - timeStart > 130) array.push(`-${timeEnd - timeStart}`)
    else array.push(`.${timeEnd - timeStart}`);

    // Starts timing of length between clicks.
    betweenTimeStart = new Date();
});

// Stop sounds in case mouse leaves the button while clicked.
key.addEventListener("mouseleave", function () {
    keySound.stop();
});


// A promise used as a timer.
const timer = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Replays whatever was pressed on the button.
const replay = async function () {
    console.log(...array);
    console.log(...arrayDelays);
    // Displays dots/dashes of replay.
    morseText.textContent = morseCode();
    textDiv.style.opacity = "100%";

    // Plays from an array that stored dots/dashes and their respective duration.
    for (let i = 0; i < array.length; i++) {
        keySound.play();
        await timer(array[i].slice(1));
        keySound.stop();
        await timer(arrayDelays[i + 1]);
    };

};
replayKey.addEventListener("click", replay);

// Creates a dot/dash string of the stored clicks.
let morseCodeString = [];
const morseCode = function () {
    for (let i = 0; i < array.length; i++) {
        morseCodeString.push(array[i][0]);
    }
    return morseCodeString.join("")
};

// Translation button.
buttonTranslate.addEventListener("click", function () {

    translationText.textContent = "";
    const message = inputTranslateField.value.toLowerCase();

    translationText.textContent = translateIntoMorse(message);
    translationText.style.opacity = "100%";
});


// Starts audio reproduction of morse that was translated.
buttonPlayTranslation.addEventListener("click", function () {
    playTranslation();
});


//////////// Used for translating into morse. ////////////////
const alphabetArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', " "];
const morseArray = ['.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....', '..', '.---', '-.-', '.-..', '--', '-.', '---', '.--.', '--.-', '.-.', '...', '-', '..-', '...-', '.--', '-..-', '-.--', '--..', "/"];
//////////////////////////////////////////////////////////////

// Returns a string of morse code that was translated from the user input.
const translateIntoMorse = function (message) {
    const criptedMessage = [];

    for (let i = 0; i < message.length; i++) {
        let letterNumber = alphabetArray.indexOf(message[i]);
        //console.log(letterNumber);
        criptedMessage.push(morseArray[letterNumber])
    }
    // console.log(criptedMessage.join("  "));
    playMessage = criptedMessage.join("  ");
    return criptedMessage.join("  ");
};

/// Plays the audio created from text translated into morse code.
let playMessage;
const playTranslation = async function () {
    for (let i = 0; i < playMessage.length; i++) {
        if (playMessage[i] == ".") {
            keySound.play();
            await timer(65);
            keySound.stop();
            await timer(75);
        };

        if (playMessage[i] == "-") {
            keySound.play();
            await timer(200);
            keySound.stop();
            await timer(75);
        };

        if (playMessage[i] == " ") {
            await timer(150);
        }
        if (playMessage[i] == "/") {
            await timer(300);
        };

    };
};



