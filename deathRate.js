const data1 = [
  {
    'State': '0-9',
    'male':0.1,
    'Female': 0.3
  },
  {
    'State': '10-19',
    'male':0,
    'Female': 0
  },
  {
    'State': '20-29',
    'male':0.2,
    'Female': 0
  },
  {
    'State': '30-39',
    'male':0.5,
    'Female': 0.2
  },
  {
    'State': '40-49',
    'male':1.6,
    'Female': 0.4
  },
  {
    'State': '50-59',
    'male':4.5,
    'Female': 1.1
  },
 {
    'State': '60-69',
    'male':13.5,
    'Female': 6.2
  },
     {
    'State': '70-79',
    'male':13.5,
    'Female': 18.2
  },
     {
    'State': '80-89',
    'male': 44.4,
    'Female': 23.5
  },
     {
    'State': '>90',
    'male':47.7,
    'Female': 24.3
  },
    {
    'State': 'Total',
    'male':17.7,
    'Female': 10.4
  }
  
];

const keys = Object.keys(data1[0]).slice(1);
    
const tip = d3.tip().html(d=> d.value);

const margin1 = {
    top: 10,
    right: 20,
    bottom: 20,
    left: 30
  },
  width1 = 600,
  height1 = 500,
  innerWidth = width1 - margin1.left - margin1.right,
  innerHeight = height1 - margin1.top - margin1.bottom,
  svg1 = d3.select('#deathrate').append('svg').attr('width', width1).attr('height', height1)
  g = svg1.append('g').attr('transform', `translate(${margin1.left}, ${margin1.top})`);
    
svg1.call(tip)

const x0 = d3.scale.ordinal()
  .rangeRoundBands([0, innerWidth], .1)
  ;

const x1 = d3.scale.ordinal().rangeRoundBands([0, innerWidth], .05);

const y = d3.scale.linear()
  .rangeRound([innerHeight, 0]);

const z = d3.scale.ordinal()
  .range(['rgb(40, 118, 221)', 'rgb(15, 40, 62)']);
    
  x0.domain(data1.map(d => d.State));
  x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data1, d => d3.max(keys, key=> d[key]))]).nice();

g.append('g')
  .selectAll('g')
  .data(data1)
  .enter()
  .append('g')
  .attr('transform', d => 'translate(' + x0(d.State) + ',.0)')
  .selectAll('rect')
  .data(d => keys.map(key => {return {key: key, value: d[key]}}))
  .enter().append('rect')
  .attr('x', d => x1(d.key))
  .attr('y', d => y(d.value))
  .attr('width', x1.rangeBand())
  .attr('height', d => innerHeight - y(d.value))
  .attr('fill', d =>  z(d.key))
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide)

g.append('g')
  .attr('class', 'axis-bottom')
  .attr('transform', 'translate(0,' + innerHeight + ')')
  .call(d3.svg.axis().scale(x0));

g.append('g')
  .attr('class', 'axis-left')
  .call(d3.svg.axis().scale(y).orient("left"))
  .append('text')
  .attr('x', 10)
  .attr('y', y(y.ticks().pop()) -40)
  .attr('dy', '0.10em')
  .attr('fill', '#000')
  .style('transform', 'rotate(-90deg)')
  .attr('font-weight', 'none')
  .attr('text-anchor', 'end')
  .text('Death Rate in %');

      
const legend = g.append('g')
   .attr('font-family', 'sans-serif')
   .attr('font-size', 10)
   .attr('text-anchor', 'end')
   .selectAll('g')
   .data(keys.slice().reverse())
   .enter().append('g')
   .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');

legend.append('rect')
  .attr('x', innerWidth - 19)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', z);

legend.append('text')
  .attr('x', innerWidth - 32)
  .attr('y', 6)
  .attr('dy', '0.32em')
  .text(d => d);
