import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const WorkoutBarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        if (!data || data.length === 0) {
            // No data, clear the SVG and exit the effect early
            svg.append("text")
                .attr("x", 250)
                .attr("y", 150)
                .attr("text-anchor", "middle")
                .text("No Workout data available")
                .attr("font-size", "16px")
                .attr("fill", "gray");
            return;
        }

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const groupedData = data.map(d => [
            { key: 'time', value: d.time },
            { key: 'calories_burnt', value: d.calories_burnt },
        ]);

        const x0 = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, width])
            .padding(0.2);

        const x1 = d3.scaleBand()
            .domain(['time', 'calories_burnt'])
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.time, d.calories_burnt) + 20)])
            .nice()
            .range([height, 0]);

        const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Draw bars
        chart.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x0(d.name)},0)`)
            .selectAll("rect")
            .data(d => groupedData[data.indexOf(d)])
            .join("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => d.key === 'time' ? "steelblue" : "orange");

        // Add text labels for each bar
        chart.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x0(d.name)},0)`)
            .selectAll("text")
            .data(d => groupedData[data.indexOf(d)])
            .join("text")
            .attr("x", d => x1(d.key) + x1.bandwidth() / 2)
            .attr("y", d => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .text(d => d.value)
            .attr("font-size", "12px")
            .attr("fill", "black");

        // X axis
        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0));

        // Y axis
        chart.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 80}, ${margin.top})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "steelblue");
        legend.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text("Time")
            .attr("font-size", "12px")
            .attr("fill", "black");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "orange");
        legend.append("text")
            .attr("x", 20)
            .attr("y", 32)
            .text("Calories Burnt")
            .attr("font-size", "12px")
            .attr("fill", "black");

        // Title
        svg.append("text")
            .attr("x", width / 1.6)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .text("Workout Information: Time and Calories per Exercise")
            .attr("font-size", "10px")
            .attr("fill", "black");

    }, [data]);

    return <svg ref={svgRef} width={500} height={300}></svg>;
};

export default WorkoutBarChart;
