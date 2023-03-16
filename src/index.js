import {bubbleUp} from "./scripts/data";


const loadSound = new Audio('./assets/bubble-pop-6395.mp3')
bubbleUp(); 

// async function call(){
// }

// call();

window.reload = function() {
    d3.selectAll('svg').remove();
    d3.selectAll('.tooltip').remove();
    loadSound.play();
    bubbleUp();
    d3.selectAll('.direction').remove();
}

