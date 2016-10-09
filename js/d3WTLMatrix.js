/**
 * Created by gvandewiele on 10/9/16.
 */

// var brewer10 = colorbrewer.RdYlGn[10]


var acc_metrics = "data/results_d3_acc.csv";
var balacc_metrics = "data/results_d3_balacc.csv";
var WTLAccMatrix  = "data/results_wtl_acc.csv";
var WTLBalAccMatrix  = "data/results_wtl_balacc.csv";
var id_moviemap;

d3.csv(WTLAccMatrix, function(wtl){

    createMatrixVisualization(wtl, '#accMatrix');

});

d3.csv(WTLBalAccMatrix, function(wtl){

    createMatrixVisualization(wtl, '#balaccMatrix');

});

function createMatrixVisualization(wtl, html_elt) {

    console.log(wtl);
    var nrows = wtl.length;
    var matrix = new Array(nrows);
    var algorithms = new Array(nrows);
    // for (var i = 0; i < nrows; i++) {
    //     matrix[i] = new Array(nrows);
    //     for (var j = 0; j < nrows; j++) {
    //         matrix[i][j] = Math.random()*2 - 1;
    //     }
    // }
    for (row in wtl) {
        matrix[row] = new Array(nrows);
        var counter = 0;
        for (var property in wtl[row]) {
            if (wtl[row].hasOwnProperty(property)) {
                if (property == "algorithm"){ algorithms[row] = wtl[row][property] }
                else { matrix[row][counter] = wtl[row][property]; counter++; }
            }
        }
    }
    console.log(algorithms);
    console.log(matrix);
    var margin = {top: 125, right: 0, bottom: 0, left: 110};
    cellSize = {height: 25, width: 25},
    width = (nrows + 1) * (cellSize.width + 1),
    height = nrows * (cellSize.height + 1);

    // // Create associative array using the dict dataframe
    //     movies_dict = new Array(movies.length)
    //     for (movie in movies) {
    //         movies_dict[movies[movie].code] = movies[movie].title;
    //     }

    // Tooltip variable, will be populated with text when you hover over a cell
        var tooltip = d3.select('body')
            .append("div").attr("id", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("a simple tooltip");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d, i, j) {
            return "<span style='color:rgba(0, 0, 255, 0.6); font-size: 10px;'>" + algorithms[j] + ' vs ' + algorithms[i] + ': ' + d; + "</span>";
        });

    var svg = d3.select(html_elt).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 0);

    var x = d3.scale.ordinal()
        .domain(d3.range(nrows))
        .rangeBands([0, width]);
    var y = d3.scale.ordinal()
        .domain(d3.range(nrows))
        .rangeBands([0, height]);
    var rowLabels = new Array(nrows);
    for (var i = 0; i < nrows; i++) {
        rowLabels[i] = algorithms[i];
    }
    var columnLabels = new Array(nrows);
    for (var i = 0; i < nrows; i++) {
        columnLabels[i] = algorithms[i];
    }

    var colorMap = d3.scale.linear()
        .domain([-1, 0, 1])
        .range(["red", "white", "blue"]);
    //.range(["red", "black", "green"]);
    //.range(["brown", "#ddd", "darkgreen"]);
    var row = svg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });
    row.selectAll(".cell")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return x(i); })
        .attr("width", x.rangeBand())
        .attr("height", y.rangeBand())
        .style("stroke-width", 0);
    row.append("line")
        .attr("x2", width);
    row.append("text")
        .attr("x", 0)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return algorithms[i]; });
    var column = svg.selectAll(".column")
        .data(columnLabels)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
    column.append("line")
        .attr("x1", -width);
    column.append("text")
        .attr("x", 6)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) { return d; });
    row.selectAll(".cell")
        .data(function(d, i) { return matrix[i]; })
        .style("fill", function(d, i){
            if (d == '0-0-0') return 'none';
            wtl_entry = d.split('-');
            var win = parseInt(wtl_entry[0]);
            var tie = parseInt(wtl_entry[1]);
            var loss = parseInt(wtl_entry[2]);
            var total = win+tie+loss;
            if (win > loss) { var fraction = win/total; return d3.rgb(0,Math.min(50+fraction*255, 255),0); }
            else if (loss > win) { var fraction = loss/total; return d3.rgb(Math.min(50+fraction*255, 255),0,0); }
            else { var fraction = tie/total; return d3.rgb(Math.min(fraction*128, 128)+75,Math.min(fraction*128, 128)+75,0); }
            // if (win > tie && win > loss) return 'green';
            // else if (loss > tie && loss > win) return 'red';
            // else return 'yellow';
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function(d,i,j){createTable(algorithms[j], algorithms[i]);});

    svg.call(tip);

}

function createTable(algorithm1, algorithm2) {
    console.log(algorithm1, algorithm2);
}