!function(){"use strict";!function(){const e=new Audio("./assets/bubble-pop-6395.mp3");async function n(){await function(){const e=d3.select("#my_dataviz").append("svg").attr("id","chart").attr("viewBox","0 -15 900 400").attr("preserveAspectRatio","xMidYMid meet").style("border-radius","5px");console.log(numCoins.value),d3.json(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${parseInt(numCoins.value)}&page=1&sparkline=false`).then((function(n){n.map((e=>{Math.abs(e.price_change_percentage_24h)>100?e.change="crazy":e.price_change_percentage_24h>0&&e.price_change_percentage_24h<100?e.change="up":e.price_change_percentage_24h<0?e.change="down":null===e.price_change_percentage_24h&&(e.change="down",e.price_change_percentage_24h=0)})),n.map((e=>{e.market_cap>1e9?e.toolMC=`$${(e.market_cap/1e9).toFixed(2)}B`:e.toolMC=`$${(e.market_cap/1e6).toFixed(2)}M`})),n.map((e=>{e.total_volume>1e9?e.toolTV=`$${(e.total_volume/1e9).toFixed(2)}B`:e.toolTV=`$${(e.total_volume/1e6).toFixed(2)}M`})),n.map((e=>{e.price_change_percentage_24h>1?e.toolPC=`+${e.price_change_percentage_24h.toFixed(2)}%`:e.toolPC=`${e.price_change_percentage_24h.toFixed(2)}%`}));const t=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});console.log(n);let a=n.filter((e=>e.price_change_percentage_24h<0)),r=n.filter((e=>e.price_change_percentage_24h>0)),c=n.filter((e=>"crazy"===e.change));function o(e){let n={price_change_percentage_24h:0};for(let t=0;t<e.length;t++)n.price_change_percentage_24h>e[t].price_change_percentage_24h&&"crazy"!==e[t].change&&(n=e[t]);return n}function p(e){let n={price_change_percentage_24h:0};for(let t=0;t<e.length;t++)n.price_change_percentage_24h<e[t].price_change_percentage_24h&&"crazy"!==e[t].change&&(n=e[t]);return n}function s(){return Math.abs(o(a).price_change_percentage_24h)>p(r).price_change_percentage_24h?Math.abs(o(a).price_change_percentage_24h):p(r).price_change_percentage_24h}console.log(`${a.length} downs `),console.log(`${r.length} ups `),console.log(c),console.log(function(e){let n=0;return e.forEach((e=>{n+=Math.abs(e.price_change_percentage_24h)})),numCoins.value,e.forEach((e=>{e.price_change_percentage_24h})),n}(n)),console.log(function(e){let n={small:0,big:0,crazy:0};return e.forEach((e=>{Math.abs(e.price_change_percentage_24h)<50?n.small+=1:Math.abs(e.price_change_percentage_24h)>50&&Math.abs(e.price_change_percentage_24h)<90?n.big+=1:Math.abs(e.price_change_percentage_24h)>80&&(n.crazy+=1)})),console.log(n),n.small>=n.big?9:5}(n)),console.log(s()),console.log(o(a)),console.log(p(r));const i=d3.scaleOrdinal().domain(["down","up"]).range(["#fc0303","#03fc2c"]),l=d3.scaleLinear().domain([0,8*s()/10,s()]).range((h=numCoins.value)<11?[30,60,65]:h<100?[25,40,50]:[5,25,60]);var h;const g=d3.scaleLinear().domain([0,8*s()/10,s()]).range(function(e){return e<11?[25,50,55]:e<100?[20,30,35]:[2,17,50]}(numCoins.value)),_=d3.scaleLinear().domain([0,8*s()/10,s()]).range(function(e){return e<11?[13,25,30]:e<100?[7.5,13,15]:[2,10,13]}(numCoins.value)),d=d3.scaleOrdinal().domain(["up","down"]).range([50,200]),b=d3.select("#toolbox").append("ul").style("opacity",0).attr("class","tooltip").style("border-color","white").style("border","solid").style("border-width","4px").style("border-radius","5px"),u=(d3.select("#toolbox").append("p").attr("class","direction").html("One coin can't win, together they might have a chance.<br>This website was created to provide a quick overview of the current crypto market condition using bubbles.  Click bubble for more information and drag to interact with them.").style("text-align","center"),new Audio("./assets/pop2.mp3")),m=e.append("g").selectAll("circle").data(n).join("circle").attr("class","node").attr("r",(e=>l(Math.abs(e.price_change_percentage_24h)))).attr("cx",450).attr("cy",200).style("fill",(function(e){return"url(#"+e.name.toLowerCase().replaceAll(" ","-")+")"})).style("fill-opacity",1).attr("stroke",(e=>i(e.change))).style("stroke-width",1.5).on("mousedown",(function(e,n){u.play()})).on("mouseover",(function(e,n){b.style("opacity",1),d3.selectAll(".direction").remove()})).on("mousemove",(function(e,n){b.html(`&nbsp;&nbsp;&nbsp; Name: ${n.name} &nbsp;&nbsp;&nbsp;\n                    |&nbsp;&nbsp;&nbsp; Current Price: ${t.format(n.current_price)} &nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;Symbol: ${n.symbol.toUpperCase()} &nbsp;&nbsp;&nbsp; \n                    |&nbsp;&nbsp;&nbsp;24Hr Change: ${n.toolPC} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;\n                    High 24Hr: ${t.format(n.high_24h)} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;\n                    Low 24Hr: ${t.format(n.low_24h)}<br>Rank: ${n.market_cap_rank}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Market Cap: ${n.toolMC}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;24H Volume: ${n.toolTV}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;ATH: ${t.format(n.ath)} on ${n.ath_date.slice(0,10)}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;ATL: ${t.format(n.atl)} on ${n.atl_date.slice(0,10)}`).style("left",e.x/2+20+"px").style("top",e.y/2-30+"px")})).on("mouseleave",(function(e,n){b.style("opacity",1)})).call(d3.drag().on("start",(function(e,n){e.active||y.alphaTarget(.03).restart(),n.fx=n.x,n.fy=n.y})).on("drag",(function(e,n){n.fx=e.x,n.fy=e.y})).on("end",(function(e,n){e.active||y.alphaTarget(.03),n.fx=null,n.fy=null}))),f=e.selectAll(null).data(n).enter().append("text").text((e=>e.price_change_percentage_24h<0?`${e.price_change_percentage_24h.toFixed(1)}%`:e.price_change_percentage_24h>0?`+${e.price_change_percentage_24h.toFixed(1)}%`:"0%")).attr("font-size",(e=>_(Math.abs(e.price_change_percentage_24h)))).attr("text-anchor","middle");e.selectAll("coinImage").data(n).enter().append("pattern").attr("class","coinImage").attr("id",(function(e){return e.name.toLowerCase().replaceAll(" ","-")})).attr("height","100%").attr("width","100%").attr("patternContentUnits","objectBoundingBox").append("image").attr("height",1).attr("width",1).attr("preserveAspectRatio","none").attr("xlink:href",(e=>e.image));const y=d3.forceSimulation().force("x",d3.forceX().strength(.1).x(40)).force("y",d3.forceY().strength(.8).y((e=>d(e.change)))).force("center",d3.forceCenter().x(450).y(200)).force("charge",d3.forceManyBody().strength(.1)).force("collide",d3.forceCollide().strength(.2).radius((function(e){return l(Math.abs(e.price_change_percentage_24h)+3)})).iterations(5));y.nodes(n).on("tick",(()=>{m.attr("cx",(e=>e.x)).attr("cy",(e=>e.y)),f.attr("x",(e=>e.x)).attr("y",(e=>e.y+g(Math.abs(e.price_change_percentage_24h))))}))}))}()}n(),window.reload=function(){d3.selectAll("svg").remove(),d3.selectAll(".tooltip").remove(),e.play(),n(),d3.selectAll(".direction").remove()}}()}();
//# sourceMappingURL=main.js.map