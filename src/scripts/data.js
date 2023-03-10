export function bubbleUp(){

    // set the dimensions and margins of the graph
    const width = 960
    const height = 500

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("id", "chart")
        .attr("viewBox", "0 0 960 500") //dynamic width & height
        .attr("preserveAspectRatio", "xMidYMid meet") //dynamic width & height

    // Read data
    d3.json("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false").then( function(data) {
        
        // add change properties to each coin whether they are up or down based on price_change_percentage_24h
        data.map((el) => {
            if (el.price_change_percentage_24h > 0) {
                el['change'] = "up"
            } else {
                el['change'] = 'down'
            }
        })

        let downs = data.filter((el) => el.price_change_percentage_24h < 0)
        let ups = data.filter((el) => el.price_change_percentage_24h > 0)
        console.log(`${downs.length} downs `)
        console.log(`${ups.length} ups `)
        
        //find the worst performing coin to use for size scaling
        function bottom(arr) {
            let result = {price_change_percentage_24h: 0}
            for (let i = 0; i < arr.length; i++){
                if (result.price_change_percentage_24h > arr[i].price_change_percentage_24h){
                    result = arr[i]
                }
            }
            return result;
        }

        //find the best performing coin to use for size scaling
        function top(arr) {
            let result = {price_change_percentage_24h: 0}
            for (let i = 0; i < arr.length; i++){
                if (result.price_change_percentage_24h < arr[i].price_change_percentage_24h){
                    result = arr[i]
                }
            }
            return result;
        }

        //compare bottom and top and use for size scaling
        function max(){
            if (Math.abs(bottom(downs).price_change_percentage_24h) > top(ups).price_change_percentage_24h){
                return Math.abs(bottom(downs).price_change_percentage_24h);
            } else {
                return top(ups).price_change_percentage_24h;
            }
        }

        console.log(bottom(downs))
        console.log(top(ups))
        

        // Color palette for change up/ down
        const color = d3.scaleOrdinal()
            .domain(["down", "up"])
            .range(["red", "green"]);

        // Size scale for coin/bubbles based on top/worst performing coin
        const size = d3.scaleLinear()
            .domain([0, max()]) //added 10 to make it to appear within desire location
            .range([7, 55])  // circle will be between 7 and 55 px wide

        const y = d3.scaleOrdinal()
            .domain(["up", "down"])
            .range([10, 100])

        //-------------------------------------
        // create a tooltip
        const Tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event, d) {
            Tooltip
            .style("opacity", 1)
        }
        const mousemove = function(event, d) {
            Tooltip
            .html('<u>' + d.name + '</u>' + "<br>" + d.price_change_percentage_24h.toFixed(2) + '%')
            .style("left", (event.x/2+20) + "px")
            .style("top", (event.y/2-30) + "px")
        }
        const mouseleave = function(event, d) {
            Tooltip
            .style("opacity", 0)
        }

        // Initialize the circle: all located at the center of the svg area
        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("class", "node")
            .attr("r", d => size(Math.abs(d.price_change_percentage_24h)))
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .html("yes")
            .style("fill", d => color(d.change))
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 2)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
                
        // Features of the forces applied to the nodes:
        const simulation = d3.forceSimulation()
            // .force("x", d3.forceX().strength(0.5).x(d => x(d.change)))
            // .force("y", d3.forceY().strength(0.1).y( height / 2  ))
            .force("x", d3.forceX().strength(0.1).x( height / 2 ))
            .force("y", d3.forceY().strength(1).y( d => y(d.change) ))
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(Math.abs(d.price_change_percentage_24h))+7) }).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function(d){
                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            });

        // What happens when a circle is dragged?
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


