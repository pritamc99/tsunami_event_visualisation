
var url = './data/health_status.csv'

d3.csv(url, function(error, data){
    data.forEach(function (d) {
      d.income = +d.income;
    });
    // console.log(data)
    var margin = {top: 65, bottom: 100, left: 50, right: 30}, axisPadding = 10;
    var Width = 500, Height = 350;
    var svgWidth = Width + margin.left + margin.right,
        svgHeight = Height + margin.top + margin.bottom;
    var maxIncome = d3.max(data, function(d){ return d.income; });
    
    
    // define scales and axises
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d){ return d.country; }))
        .rangeBands([0, Width], 0.1);
    var yScale = d3.scale.linear()
        .domain([0, maxIncome])
        .range([0, Height]);
    var color = d3.scale.category10();
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0,0)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale.copy().domain([maxIncome, 0]))
        .tickSize(6,0)
        .ticks(5)
        .orient('left');
    
    // create a svg canvas
    var svg = d3.select('#heathcauses')
        .append('svg')
        .attr({width: svgWidth, height: svgHeight})
    
    
    // Drawing for axises
    var xGroup = svg.append('g')
        .attr('class', 'xGroup')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height + axisPadding] + ')');
    xGroup.call(xAxis)
    .selectAll("text")
    	.style("font-size", "10px")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.35em")
      	.attr("transform", "rotate(-40)" );
    styleAxis(xGroup);
    var yGroup = svg.append('g')
        .attr('class', 'yGroup')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    yGroup.call(yAxis);
    styleAxis(yGroup);
    
  


    // Label layer
    var label = svg.append('g')
        .attr('transform', 'translate(' + [margin.left - axisPadding, margin.top] + ')');
    label.append('text')
        .text('patients Count')
        .attr('transform', 'rotate(-90)')
        .attr({
            'text-anchor': 'start',
            x: -65,
            y: 20,
        })
    label.append('text')
        .attr('transform', 'translate(' + [Width / 2, - margin.top / 2] + ')')
        .attr({
            'text-anchor': 'middle',
            'font-size': '1.5em',
            fill: 'steelblue',
        });


    // Drawing for graph body
    var graph = svg.append('g')
        .attr('class', 'graph')
        .attr('transform', 'translate(' + [margin.left, margin.top + Height] + ')');
    var bars = graph.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d,i){ return 'translate(' + [xScale(d.country), -1 * yScale(d.income)] + ')'; });
    bars.append('rect')
        .each(function(d,i){
            d3.select(this).attr({
                fill: "rgb(40, 118, 221)",   
                width: xScale.rangeBand(),
                height: yScale(d.income),
            })
        })
        	
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    bars.append('text')
    .text(function(d){ return d.income; })
    .each(function(d,i){
        d3.select(this).attr({
            fill: color.range()[i],
            stroke: 'none',
            x: xScale.rangeBand() / 2,
            y: -5,
            'text-anchor': 'middle',
        });
    })
    
    
    
    // tooltips
    var div = d3.select('#heathstatus').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
    function mouseover(){
        div.style('display', 'inline');
    }
    function mousemove(){
        var d = d3.select(this).data()[0]
        div
            .html(d.country + '<hr/>' + d.income)
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
    }
    function mouseout(){
        div.style('display', 'none');
    }
})

.on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.label)+"<br>"+(d.value)+"%");
            });

function styleAxis(axis){
    // style path
    axis.select('.domain').attr({
        fill: 'none',
        stroke: '#888',
        'stroke-width': 1
    });
    // style tick
    axis.selectAll('.tick line').attr({
        stroke: '#000',
        'stroke-width': 1,
    })
}
