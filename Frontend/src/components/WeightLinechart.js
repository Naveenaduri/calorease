import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const WeightLineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Display an error message if no data
        if (data.length === 0) {
            svg.append("text")
                .attr("x", 250)
                .attr("y", 150)
                .attr("text-anchor", "middle")
                .text("No data available")
                .attr("font-size", "16px")
                .attr("fill", "red");
            return;
        }

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Parse and format the date scale
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        // Y-axis scale for weight
        const y = d3.scaleLinear()
            .domain([d3.min(data, d => d.weight), d3.max(data, d => d.weight) + 20])
            .nice()
            .range([height, 0]);

        // Line generator for the weight data
        const line = d3.line()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.weight));

        const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Line path
        chart.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // X-axis with date formatting in MM-DD-YYYY format
        const xAxisFormat = d3.timeFormat("%m-%d-%Y");
        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(xAxisFormat));

        // Y-axis for weight
        chart.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Add graph title
        svg.append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", margin.top / 2 + 10)
            .attr("text-anchor", "middle")
            .text("Weight Progress Over Time")
            .attr("font-size", "16px")
            .attr("fill", "black");

        // Add data point values on the graph
        chart.selectAll(".data-point")
            .data(data)
            .join("circle")
            .attr("class", "data-point")
            .attr("cx", d => x(new Date(d.date)))
            .attr("cy", d => y(d.weight))
            .attr("r", 4)
            .attr("fill", "steelblue");

        // Add labels for the data points
        chart.selectAll(".data-label")
            .data(data)
            .join("text")
            .attr("class", "data-label")
            .attr("x", d => x(new Date(d.date)))
            .attr("y", d => y(d.weight) - 5)
            .text(d => `${d.weight} lb`)  // Label the data points with their weight value
            .attr("fill", "black")
            .attr("font-size", "12px");

    }, [data]);

    return <svg ref={svgRef} width={500} height={300}></svg>;
};

export default WeightLineChart;
