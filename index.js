let timer = document.getElementById("timer");
let wpm = document.getElementById("wpm");
let quotes = document.getElementById("quote");
let container = document.getElementById("container");
var myQuotes;
var timerIsSet = false;
var idx = 0; 
var startTime;
var timmerId;
var strokes;


let random_quotes = "https://api.quotable.io/random";
let getRamdomQuotes = async() => {
    let response = await fetch(random_quotes);
    let data = await response.json();
    return data.content;
}

quotes.innerHTML = "";
let populateRandomQuotes = async()=>{
    myQuotes = await getRamdomQuotes();
    quotes.innerHTML ="";
    idx = 0;
    strokes = new Array(myQuotes.length);
    strokes.fill(0);
    myQuotes.split("").forEach(element => {
        let spanChar = document.createElement("span");
        spanChar.innerHTML = element;
        quotes.appendChild(spanChar);
    }); 
}
populateRandomQuotes();



function startTimer(){
    timerIsSet = true;
    startTime = new Date();
    timmerId = setInterval(()=>{
        timer.innerHTML = timeElapsed();
    },1000);
}
function resetTimer(){
    timerIsSet = false;
    clearInterval(timmerId);
}
function timeElapsed(){
    return Math.floor((new Date() - startTime) / 1000)
}

window.addEventListener('click', (event)=>{
    calculateWpm();
    if(container.contains(event.target)){
        if(!timerIsSet){
            container.classList.add('container-focus');
            startTimer();
        }
    }
    else{
        container.classList.remove('container-focus');
        resetTimer();
        timer.innerHTML ='0';
    }
})

window.addEventListener('keydown',(event)=>{
    calculateWpm();
    if(event.key == "Shift" || event.key == "Alt" || event.key == "CapsLock"){
        return;
    }
    if(event.key=="Backspace"){
        if(idx == 0){
            return;
        }
        else{
            idx--;
            quotes.childNodes[idx].classList.remove('incorrect');
            quotes.childNodes[idx].classList.remove('correct');
            return;
        }
    }
    if(timerIsSet){
       if(myQuotes[idx] == event.key){
        quotes.childNodes[idx].classList.add('correct');
        quotes.childNodes[idx].classList.remove('incorrect');
        strokes[idx] = 1;
       }
       else{
        quotes.childNodes[idx].classList.remove('correct');
        quotes.childNodes[idx].classList.add('incorrect');
       }
       idx++;
       if(idx == myQuotes.length){   
           populateRandomQuotes();
       }
    }
})
function correctStrokes(){
    let count = 0;
    strokes.forEach((el)=>{
        if(el === 1){
            count++;
        }
    })
    return count;
}
function resetStrokes(){
    strokes.fill(0);
}
function calculateWpm(){
    if(timeElapsed() > 0){
        wpm.innerHTML = Math.round(parseFloat(correctStrokes())/ 5.0 /
                     (parseFloat(timeElapsed()) / 60.0))
    }
}