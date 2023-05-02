import {bubbleUp} from "./scripts/data";


const loadSound = new Audio('./assets/bubble-pop-6395.mp3')
bubbleUp(); 

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
}

btn.onclick(); 

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

window.reload = function() {
    d3.selectAll('svg').remove();
    d3.selectAll('.tooltip').remove();
    loadSound.play();
    bubbleUp();
    d3.selectAll('.direction').remove();
}

