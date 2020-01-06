// @TODO: YOUR CODE HERE!

// svg area
var svgWidth = 1024;
var svgHeight = 800;

// chart margin
var margin = {
    top: 20,
    bottom: 20,
    right: 20,
    left: 20
}

// chart area
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;


// define svg using D3
var svg = d3
    .select("#scatter")
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// create chart group, align chart within SVG
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// set default X & Y axis    
var chosenXAxis = 'poverty';
var chosenYAxis = 'smokes';

// 
function xScale(data, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8, d3.max(data, d => d[chosenXAxis]) * 0.8])
        .range([0, width]);

    return xLinearScale;

}

function yScale(data, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8, d3.max(data, d => d[chosenYAxis]) * 0.8])
        .range([height, 0]);

    return yLinearScale;

}

function renderAxes(newXScale, newYScale, xAxis, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);

    xAxis.transition()
        .duration(500)
        .call(bottomAxis);
    
    yAxis.transition()
        .duration(500)
        .call(leftAxis);

    return xAxis, yAxis;

}



function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(500)
        .attr('cx', d => newXScale(d[chosenXAxis]))
        .attr('cy', d => newYScale(d[chosenYAxis]))

    return circlesGroup;

}

// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {}

//     // update X-axis label text

//     if (chosenXAxis === 'poverty') {
//         var xLabel = '% in Poverty';
//     } 
//     else 
//     if (chosenXAxis === 'age') {
//         var xLabel = 'Age (Median)';
//     }
//     else
//         var xlable = 'Household Income';

//     // update Y-axis label text
    
//     if (chosenYAxis === 'obesity') {
//         var yLabel = 'Obese (%)';
//     }
//     else
//     if (chosenYAxis === 'smokes') {
//         var yLabel = 'Smokes (%)';
//     }
//     else
//     if (chosenYAxis === 'healthcare')
//         var yLabel = 'Lacks Healthcare (%)';
//     }

// grab data from csv
d3.csv('../data/data.csv').then(function(data, err) {
    if (err) throw err;

    data.forEach(function(data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
    });

    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append('g')
        .classed('y-axis', true)
        .attr('transform', `translate(${width}, 0)`)
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.num_hits))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5")
        .attr('stroke', 'black');

    var labelsGroupX = chartGroup.append('g')
        .attr('transform', `translate(${width / 3}, ${height + 20})`);

    var obeseLabel = labelsGroupX.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'obese')
        .classed('active', true)
        .text('Obese (%)');

    var smokesLabel = labelsGroupX.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'smokes')
        .classed('active', true)
        .text('Smokes (%)');

    var healthCareLabel = labelsGroupX.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'healthcare')
        .classed('active', true)
        .text('Lacks Healthcare (%)');

    var labelsGroupY = chartGroup.append('g')
        .attr('transform', `translate(${width + 20}, ${height / 3})`);

    var povertyLabel = labelsGroupY.append('text')
        .attr('x', 20)
        .attr('y', 0)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (%)');

    var ageLabel = labelsGroupY.append('text')
        .attr('x', 40)
        .attr('y', 0)
        .attr('value', 'age')
        .classed('active', true)
        .text('Age (Median)');

    var incomeLabel = labelsGroupY.append('text')
        .attr('x', 60)
        .attr('y', 0)
        .attr('value', 'income')
        .classed('active', true)
        .text('Household Income (Median)');

    labelsGroupX.selectAll('text')
        .on('click', function() {

            var value = d3.select(this).attr('value');
            if (values !== chosenXAxis) {
                
                chosenXAxis = value;

                xLinearScale = xScale(data, chosenXAxis);
                xAxis = renderAxes(xLinearScale,_,xAxis,_);
    
                circlesGroup = rengerCircles(circlesGroup, xLinearScale,_,chosenXAxis,_);

                
            }
        });
}).catch(function(error) {
    console.log(error);
});