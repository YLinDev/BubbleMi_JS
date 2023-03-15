export function bubbleUp(){

    // set the dimensions and margins of the graph
    const width = 900
    const height = 400

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("id", "chart")
            .attr("viewBox", "0 -15 900 400") //dynamic width & height
            .attr("preserveAspectRatio", "xMidYMid meet") //dynamic width & height
            .style("border-radius", "5px")

    console.log(numCoins.value)
        
        // Read data
        d3.json(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${parseInt(numCoins.value)}&page=1&sparkline=false`).then( function(data) {
            
            
        // console.log(element.value)
        // console.log(data.slice(0, parseInt(element.value)))
        // data = data.slice(0, parseInt(element.value))

        // add change properties to each coin whether they are up or down based on price_change_percentage_24h
        data.map((el) => {
            if (Math.abs(el.price_change_percentage_24h) > 100) {
                el['change'] = 'crazy'
            } else if (el.price_change_percentage_24h > 0 && el.price_change_percentage_24h < 100) {
                el['change'] = 'up'
            } else if (el.price_change_percentage_24h < 0) {
                el['change'] = 'down'
            } else if (el.price_change_percentage_24h === null) {
                el['change'] = 'down'
                el.price_change_percentage_24h = 0
            }
        })

        data.map((el) => { //convert Market Cap to strings for coininfo
            if (el.market_cap > 1000000000){
                el['toolMC'] = `$${(el.market_cap/1000000000).toFixed(2)}B`
            } else {
                el['toolMC'] = `$${(el.market_cap/1000000).toFixed(2)}M`
            }
        })

        data.map((el) => { //convert volume to strings for coininfo
            if (el.total_volume > 1000000000){
                el['toolTV'] = `$${(el.total_volume/1000000000).toFixed(2)}B`
            } else {
                el['toolTV'] = `$${(el.total_volume/1000000).toFixed(2)}M`
            }
        })

        data.map((el) => { //convert % change to strings for coininfo
            if (el.price_change_percentage_24h > 1){
                el['toolPC'] = `+${(el.price_change_percentage_24h).toFixed(2)}%`
            } else {
                el['toolPC'] = `${(el.price_change_percentage_24h).toFixed(2)}%`
            }
        })

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        })

        console.log(data)
        
        // data.forEach(el => console.log(el.price_change_percentage_24h))

        let downs = data.filter((el) => el.price_change_percentage_24h < 0) // find coins that are down
        let ups = data.filter((el) => el.price_change_percentage_24h > 0) // find coins that are up
        let crazys = data.filter((el) => el.change === 'crazy') // find coins that are up or down by over 100%
        console.log(`${downs.length} downs `)
        console.log(`${ups.length} ups `)
        console.log(crazys)


        
        //find the worst performing coin to use for size scaling
        function bottom(arr) {
            let result = {price_change_percentage_24h: 0}
            for (let i = 0; i < arr.length; i++){
                if (result.price_change_percentage_24h > arr[i].price_change_percentage_24h && arr[i].change !== 'crazy'){
                    result = arr[i]
                }
            }
            return result;
        }
        
        //find the best performing coin to use for size scaling
        function top(arr) {
            let result = {price_change_percentage_24h: 0}
            for (let i = 0; i < arr.length; i++){
                if (result.price_change_percentage_24h < arr[i].price_change_percentage_24h && arr[i].change !== 'crazy'){
                    result = arr[i]
                }
            }
            return result;
        }

        function topCrazys(arr) {
            let result = {price_change_percentage_24h: 0}
            for (let i = 0; i < arr.length; i++){
                if (result.price_change_percentage_24h < Math.abs(arr[i].price_change_percentage_24h)){
                    result = arr[i]
                }
            }
            return result.price_change_percentage_24h;
        }
        
        function numBelowAvg(arr) {
            let total = 0;
            arr.forEach((el) => {
                total += Math.abs(el.price_change_percentage_24h)
            })
            let avg = total / numCoins.value 
            let count = 0; 
            arr.forEach((el) => {
                if (el.price_change_percentage_24h < avg) {
                    count++; 
                }
            })
            return total; 
        }

        console.log(numBelowAvg(data))

        function addSize(num) {
            if(num < 11){
                return 20;
            } else if(num < 100) {
                return 10;
            } else {
                return 0; 
            }
        }

        function addFontSize(num) {
            if(num < 11){
                return [10, 20, 22];
            } else if(num < 100) {
                return [7.5, 17, 19];
            } else {
                return [5, 13, 15]; 
            }
        }

        function addFontAlign(num) {
            if(num < 11){
                return [25, 50, 55];
            } else if(num < 100) {
                return [15, 47, 52];
            } else {
                return [5, 45, 50]; 
            }
        }

        function sizeScale(arr) {
            let total = {
                "small": 0, 
                "big": 0,
                "crazy": 0
            };
            arr.forEach((el) => {
                if (Math.abs(el.price_change_percentage_24h) < 50){
                    total["small"] += 1; 
                } else if (Math.abs(el.price_change_percentage_24h) > 50 && Math.abs(el.price_change_percentage_24h) < 90){
                    total["big"] += 1;
                } else if (Math.abs(el.price_change_percentage_24h) > 80){
                    total["crazy"] += 1;
                } 
            })
            console.log(total)
            if (total["small"] >= total["big"]) {
                return 9;
            } else {
                return 5; 
            }
        }
        // let bubbleSize = sizeScale(data)

        console.log(sizeScale(data))

        //compare bottom and top and use for size scaling
        function max(){
            if (Math.abs(bottom(downs).price_change_percentage_24h) > top(ups).price_change_percentage_24h){
                return Math.abs(bottom(downs).price_change_percentage_24h);
            } else {
                return top(ups).price_change_percentage_24h;
            }
        }
        
        console.log(max())
        console.log(bottom(downs))
        console.log(top(ups))
        
        // const setA = {
        //     size: [5, 60],
        //     textAlign: [5, 50],
        //     fontSize: [5, 15],
        //     yCoor: [50, 200]
        // }

        // Color palette for change up/ down
        const color = d3.scaleOrdinal()
            .domain(["down", "up"])//, "crazy"
            .range(["#fc0303", "#03fc2c"]); // #046e22 , "gold"
        
        // Size scale for coin/bubbles based on top/worst performing coin
        const size = d3.scaleLinear()
            .domain([0, 50, max()]) //use max of up/down to scale bubble size , topCrazys(crazys)
            .range([sizeScale(data)+addSize(numCoins.value), 55, 60])  // circle will be between 7 and 55 px wide , 80
        
        const textAlign = d3.scaleLinear()
            .domain([0, 50, max()]) //use max of up/down to textAlignment px , topCrazys(crazys)
            .range(addFontAlign(numCoins.value))  // alignment will be between 1 - 45 additional px , 70

        const fontSize = d3.scaleLinear()
            .domain([0, 50, max()]) //added 10 to make it to appear within desire location , topCrazys(crazys)
            .range(addFontSize(numCoins.value))  // circle will be between 7 and 55 px wide , 17

        // How to stack bubbles if they are up/down
        const y = d3.scaleOrdinal()
            .domain(["up", "down"])
            .range([50, 200])
        
        //-------------------------------------
        // create a tooltip
        const Tooltip = d3.select("#toolbox")
            .append("ul")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("border-color", "white")
                .style("border", "solid")
                .style("border-width", "4px")
                .style("border-radius", "5px")
            
                
        const Sample = d3.select("#toolbox")
            .append("p")
            .attr("class", "direction")
            .html("One coin can't win, together they might have a chance." + '<br>' + "This website was created to provide a quick overview of the current crypto market condition using bubbles.  Click bubble for more information and drag to interact with them.")
            .style("text-align", "center")
              
        const mySound = new Audio('./assets/pop2.mp3')

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event, d) {
            Tooltip
                .style("opacity", 1)
                d3.selectAll('.direction').remove();
 
        }
        const mousemove = function(event, d) {
            Tooltip
                .html(
                    `&nbsp;&nbsp;&nbsp; Name: ${d.name} &nbsp;&nbsp;&nbsp;
                    |&nbsp;&nbsp;&nbsp; Current Price: ${formatter.format(d.current_price)} &nbsp;&nbsp;&nbsp;`+
                    '<br>' +
                    `&nbsp;&nbsp;&nbsp;Symbol: ${d.symbol.toUpperCase()} &nbsp;&nbsp;&nbsp; 
                    |&nbsp;&nbsp;&nbsp;24Hr Change: ${d.toolPC} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    High 24Hr: ${formatter.format(d['high_24h'])} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                    Low 24Hr: ${formatter.format(d['low_24h'])}`+ 
                    '<br>' + 
                    `Rank: ${d.market_cap_rank}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;` +
                    `Market Cap: ${d.toolMC}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;` +
                    `24H Volume: ${d.toolTV}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;` +
                    `ATH: ${formatter.format(d.ath)} on ${d.ath_date.slice(0,10)}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;` +
                    `ATL: ${formatter.format(d.atl)} on ${d.atl_date.slice(0,10)}`)
                .style("left", (event.x/2+20) + "px")
                .style("top", (event.y/2-30) + "px")
                // .style("background-color", d => color(d.change))
        }
        const mouseleave = function(event, d) {
            Tooltip
                .style("opacity", 1)
        }

        const mousedown = function(event, d) {
            mySound.play()
        }
        
        // Initialize the circle: all located at the center of the svg area
        const node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("class", "node")
            .attr("r", d => size(Math.abs(d.price_change_percentage_24h)))
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", function(d) {return "url(#" + d.name.toLowerCase().replaceAll(" ", "-") + ")"})
            .style("fill-opacity", 1)
            .attr("stroke", d => color(d.change))
            .style("stroke-width", 1.5)
            .on("mousedown", mousedown)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            ;
        
        const text = svg.selectAll(null)
            .data(data)
            .enter()
            .append("text")
            .text(d => {if (d.price_change_percentage_24h < 0) {
                    return `${d.price_change_percentage_24h.toFixed(1)}%`
                } else if (d.price_change_percentage_24h > 0) {
                    return `+${d.price_change_percentage_24h.toFixed(1)}%`
                } else {
                    return "0%"
                }
            })
            .attr('font-size', d => fontSize(Math.abs(d.price_change_percentage_24h)))
            .attr('text-anchor', 'middle')

        const icon = svg.selectAll("coinImage")
            .data(data)
            .enter()
            .append("pattern")
            .attr("class", "coinImage")
            .attr("id", function(d) {return d.name.toLowerCase().replaceAll(" ", "-")})
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", d => d.image)

            let ticked = () => {
                node.attr('cx', (data) => {
                        return data.x
                    })
                    .attr('cy', (data) => {
                        return data.y
                    });
            
                text.attr('x', (data) => {
                        return data.x
                    })
                    .attr('y', (data) => {
                        return data.y + textAlign(Math.abs(data.price_change_percentage_24h))
                    });
            }

        // Features of the forces applied to the nodes:
        const simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(.1).x( height / 10 )) //strength of bubbles if move horizontally
            .force("y", d3.forceY().strength(.8).y( d => y(d.change) )) //strength of bubbles if move vertically, greens will float on top 
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(Math.abs(d.price_change_percentage_24h)+3)) }).iterations(5)) // Force that avoids circle overlapping
            
        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
                .on("tick", ticked);

        // Drag Logic
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

    })
}


