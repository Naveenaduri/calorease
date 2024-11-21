import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const DietPieChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const radius = Math.min(width, height) / 3 - 20; // Reduced radius for both charts

        if (data.length === 0) {
            // Display an error message if no data
            svg.append("text")
                .attr("x", 350)
                .attr("y", 150)
                .attr("text-anchor", "middle")
                .text("No Diet data available")
                .attr("font-size", "16px")
                .attr("fill", "red");
            return;
        }

        const chartGroup = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Create a color scale for each data entry
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(d3.schemeCategory10);

        // Pie and arc generators
        const pie = d3.pie()
            .value(d => d.calories) // Default for first chart (Calories)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const arcLabel = d3.arc()
            .innerRadius(radius - 50)
            .outerRadius(radius - 50);

        // Pie chart for Calories
        const caloriesGroup = svg.append("g")
            .attr("transform", `translate(${width / 4}, ${height / 2.5})`); // Positioning first chart

        caloriesGroup.selectAll("path")
            .data(pie(data))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.name))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        caloriesGroup.selectAll("text")
            .data(pie(data))
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .attr("text-anchor", "middle")
            .text(d => `${d.data.name}: ${d.data.calories} cal`)
            .attr("font-size", "12px")
            .attr("fill", "black");

        // Pie chart for Protein
        const proteinGroup = svg.append("g")
            .attr("transform", `translate(${3 * width / 4}, ${height / 2.5})`); // Positioning second chart

        pie.value(d => d.protein); // Change pie generator to Protein

        proteinGroup.selectAll("path")
            .data(pie(data))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.name))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        proteinGroup.selectAll("text")
            .data(pie(data))
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .attr("text-anchor", "middle")
            .text(d => `${d.data.name}: ${d.data.protein}g protein`)
            .attr("font-size", "12px")
            .attr("fill", "black");

        // Title
        svg.append("text")
            .attr("x", width / 2.5)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("Diet Information: Calories and Protein per Food Item")
            .attr("font-size", "16px")
            .attr("fill", "black");

    }, [data]);

    return <svg ref={svgRef} width={600} height={400}></svg>;
};

export default DietPieChart;
