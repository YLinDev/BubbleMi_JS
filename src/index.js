import {bubbleUp, coinFetch} from "./scripts/data";
import GetData from "./scripts/getData";

// document.addEventListener("DOMContentLoaded", () => {

    
// })
const loadSound = new Audio('./assets/bubble-pop-6395.mp3')


async function call(){
    await bubbleUp(); 
}

call();
loadSound.play();

window.reload = function() {
    d3.selectAll('svg').remove();
    d3.selectAll('.tooltip').remove();
    loadSound.play();
    call()
    d3.selectAll('.direction').remove();
}

