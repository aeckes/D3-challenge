// @TODO: YOUR CODE HERE!

// svg area
var svgWidth = 1200;
var svgHeight = 600;

// chart margin
var margin = {
    top: 20,
    bottom: 100,
    right: 60,
    left: 100
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
var chosenXAxis = 'smokes';
var chosenYAxis = 'poverty';

// 
function xScale(data, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]), d3.max(data, d => d[chosenXAxis])])
        .range([0, width]);

    return xLinearScale;

}

function yScale(data, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]), d3.max(data, d => d[chosenYAxis])])
        .range([height, 0]);

    return yLinearScale;

}

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(300)
        .call(bottomAxis);

    return xAxis;

}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(500)
        .call(leftAxis);

    return yAxis;

}

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(300)
        .attr('cx', d => newXScale(d[chosenXAxis]))
        .attr('cy', d => newYScale(d[chosenYAxis]))

    return circlesGroup;

}

function renderLabels(circleLabel, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circleLabel.transition()
        .duration(300)
        .attr('x', d => newXScale(d[chosenXAxis]))
        .attr('y', d => newYScale(d[chosenYAxis]))

    return circleLabel;

}

// grab data from csv
d3.csv('assets/data/data.csv').then(function (data, err) {
    if (err) throw err;

    data.forEach(function (data) {
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.abbr = data.abbr;
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
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', 20)
        .attr('fill', 'lightblue')
        .attr('opacity', 0.6)
        .attr('stroke', 'gray');

    var circleLabel = chartGroup.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .attr("dy", "7px")
        .attr("dx", "-10px")
        .text(d => d.abbr);


    var xlabelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + 20})`);

    // create labels & groups

    var obeseLabel = xlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'obesity')
        .classed('active', true)
        .text('Obese (%)');

    var smokesLabel = xlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'smokes')
        .classed('active', true)
        .text('Smokes (%)');

    var healthCareLabel = xlabelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 60)
        .attr('value', 'healthcare')
        .classed('active', true)
        .text('Lacks Healthcare (%)');

    var ylabelsGroup = chartGroup.append('g')
        //.attr("transform", "rotate(-90)")
        .attr('transform', `translate(-80, ${height / 2})`);


    var povertyLabel = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', 0)
        .attr('y', 0)
        .attr('value', 'poverty')
        .classed('active', true)     
        .text('In Poverty (%)');

    var ageLabel = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('active', true)

        .text('Age (Median)');

    var incomeLabel = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .classed('active', true)

        .text('Household Income (Median)');

    xlabelsGroup.selectAll('text')
        .on('click', function () {

            var value = d3.select(this).attr('value');
            if (value !== chosenXAxis) {

                chosenXAxis = value;

                xLinearScale = xScale(data, chosenXAxis);
                //yLinearScale = yScale(data, chosenYAxis)
                xAxis = renderXAxis(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                circleLabel = renderLabels(circleLabel, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            }
        });

    ylabelsGroup.selectAll('text')
        .on('click', function () {

            var value = d3.select(this).attr('value');
            if (value !== chosenYAxis) {

                chosenYAxis = value;

                yLinearScale = yScale(data, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                circleLabel = renderLabels(circleLabel, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            }
        });

}).catch(function (error) {
    console.log(error);
});