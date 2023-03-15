import {bubbleUp, coinFetch} from "./scripts/data";
import GetData from "./scripts/getData";

// document.addEventListener("DOMContentLoaded", () => {

    
// })

async function call(){
    await bubbleUp(); 
}

call();

window.reload = function() {
    d3.selectAll('svg').remove();
    d3.selectAll('.tooltip').remove();
    call()
}
