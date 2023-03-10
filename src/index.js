import {bubbleUp, coinFetch} from "./scripts/data";
// import Example from "./scripts/example";

document.addEventListener("DOMContentLoaded", () => {
    // console.log("Hello world!")
    // const main = document.getElementById("main")
    // new Example(main); 

})

async function call(){
    // const json = await coinFetch();
    const coinInfo = await bubbleUp(); 
    // console.log(coinInfo);
    // console.log(typeof coinInfo);
}

call(); 