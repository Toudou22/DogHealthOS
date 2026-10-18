import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Breed } from '../types';

interface D3MilestoneChartProps {
  breed: Breed;
  currentAge: number;
}

const SIZE_NATIONAL_AVERAGES: Record<string, number> = {
  toy: 14.5,
  small: 13.5,
  medium: 11.5,
  large: 9.5,
  giant: 8.0
};

export default function D3MilestoneChart({ breed, currentAge }: D3MilestoneChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('*').remove();

    const avgLife = (breed.min + breed.max) / 2;
    const sizeCategory = breed.size;
    const nationalAvg = SIZE_NATIONAL_AVERAGES[sizeCategory] || 11.5;

    // Define dimensions and margins
    const width = 500;
    const height = 240;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };

    // Create SVG element
    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('overflow', 'visible');

    // Tooltip container
    const tooltip = d3
      .select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', '#1A1A1A')
      .style('color', '#FFFFFF')
      .style('border', '1.5px solid #F0ECE6')
      .style('padding', '6px 10px')
      .style('border-radius', '6px')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.65rem')
      .style('pointer-events', 'none')
      .style('z-index', '10')
      .style('box-shadow', '3px 3px 0px rgba(0,0,0,0.15)');

    // Generate data points from age 0 to max age
    const maxAgeToPlot = Math.max(avgLife, nationalAvg, currentAge) + 2;
    const steps = 40;
    const dataBreed: { age: number; vitality: number }[] = [];
    const dataNational: { age: number; vitality: number }[] = [];

    // Weibull-like survival function for visual curve:
    // vitality = 100 * exp(- (age / avg) ^ 3.5 * ln(2)) -> reaches exactly 50% at avg life expectancy
    for (let i = 0; i <= steps; i++) {
      const age = (i / steps) * maxAgeToPlot;
      
      // Breed curve
      const breedRatio = age / avgLife;
      const breedVitality = Math.max(0, 100 * Math.exp(-Math.LN2 * Math.pow(breedRatio, 3.5)));
      dataBreed.push({ age, vitality: breedVitality });

      // National curve
      const natRatio = age / nationalAvg;
      const natVitality = Math.max(0, 100 * Math.exp(-Math.LN2 * Math.pow(natRatio, 3.5)));
      dataNational.push({ age, vitality: natVitality });
    }

    // Set up Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, maxAgeToPlot])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // X Axis
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat((d) => `${d}y`);
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.55rem')
      .call((g) => g.select('.domain').attr('stroke', '#1A1A1A').attr('stroke-width', '2'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#1A1A1A'));

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${d}%`);
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis)
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '0.55rem')
      .call((g) => g.select('.domain').attr('stroke', '#1A1A1A').attr('stroke-width', '2'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#1A1A1A'));

    // Grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(8).tickSize(-height + margin.top + margin.bottom).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#1A1A1A')
      .attr('stroke-dasharray', '2,4')
      .attr('opacity', '0.1');

    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#1A1A1A')
      .attr('stroke-dasharray', '2,4')
      .attr('opacity', '0.1');

    // Line Generators
    const lineGen = d3
      .line<{ age: number; vitality: number }>()
      .x((d) => xScale(d.age))
      .y((d) => yScale(d.vitality))
      .curve(d3.curveMonotoneX);

    // Render National Average Line (dashed gray/emerald)
    svg
      .append('path')
      .datum(dataNational)
      .attr('fill', 'none')
      .attr('stroke', '#8A8680')
      .attr('stroke-width', '2')
      .attr('stroke-dasharray', '4,4')
      .attr('d', lineGen);

    // Render Breed-Specific Line (solid orange/green)
    svg
      .append('path')
      .datum(dataBreed)
      .attr('fill', 'none')
      .attr('stroke', '#FF6B4A')
      .attr('stroke-width', '3.5')
      .attr('d', lineGen);

    // Draw Breed Average Marker (50% mark)
    svg
      .append('circle')
      .attr('cx', xScale(avgLife))
      .attr('cy', yScale(50))
      .attr('r', 5)
      .attr('fill', '#FF6B4A')
      .attr('stroke', '#1A1A1A')
      .attr('stroke-width', '1.5')
      .on('mouseover', (e) => {
        tooltip
          .style('visibility', 'visible')
          .html(`<strong>${breed.name} Avg Life:</strong><br/>${avgLife.toFixed(1)} Years (50% Survival Threshold)`);
      })
      .on('mousemove', (e) => {
        tooltip
          .style('top', `${e.layerY - 45}px`)
          .style('left', `${e.layerX + 15}px`);
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    // Draw National Average Marker (50% mark)
    svg
      .append('circle')
      .attr('cx', xScale(nationalAvg))
      .attr('cy', yScale(50))
      .attr('r', 5)
      .attr('fill', '#8A8680')
      .attr('stroke', '#1A1A1A')
      .attr('stroke-width', '1.5')
      .on('mouseover', (e) => {
        tooltip
          .style('visibility', 'visible')
          .html(`<strong>National Avg (${sizeCategory}):</strong><br/>${nationalAvg.toFixed(1)} Years`);
      })
      .on('mousemove', (e) => {
        tooltip
          .style('top', `${e.layerY - 45}px`)
          .style('left', `${e.layerX + 15}px`);
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    // Highlight Current Dog's Age with vertical reference line
    if (currentAge > 0) {
      const xPos = xScale(currentAge);
      const yLimit = yScale(100);
      const yBase = yScale(0);

      // Vertical marker line
      svg
        .append('line')
        .attr('x1', xPos)
        .attr('y1', yLimit)
        .attr('x2', xPos)
        .attr('y2', yBase)
        .attr('stroke', '#2D8C6F')
        .attr('stroke-width', '1.5')
        .attr('stroke-dasharray', '3,2');

      // Intersecting dots for breed curve and national average
      const breedRatioAtAge = currentAge / avgLife;
      const breedVitAtAge = Math.max(0, 100 * Math.exp(-Math.LN2 * Math.pow(breedRatioAtAge, 3.5)));
      const natRatioAtAge = currentAge / nationalAvg;
      const natVitAtAge = Math.max(0, 100 * Math.exp(-Math.LN2 * Math.pow(natRatioAtAge, 3.5)));

      // Current age indicator dot on breed line
      svg
        .append('circle')
        .attr('cx', xPos)
        .attr('cy', yScale(breedVitAtAge))
        .attr('r', 6)
        .attr('fill', '#2D8C6F')
        .attr('stroke', '#1A1A1A')
        .attr('stroke-width', '2')
        .on('mouseover', (e) => {
          tooltip
            .style('visibility', 'visible')
            .html(`<strong>Your Dog (${breed.name}):</strong><br/>Age ${currentAge} yrs<br/>Vitality Level: ${Math.round(breedVitAtAge)}%`);
        })
        .on('mousemove', (e) => {
          tooltip
            .style('top', `${e.layerY - 55}px`)
            .style('left', `${e.layerX + 15}px`);
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'));
    }

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${margin.left + 15}, ${margin.top + 5})`);

    // Breed Legend
    legend
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 15)
      .attr('y2', 0)
      .attr('stroke', '#FF6B4A')
      .attr('stroke-width', '3');
    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 4)
      .text(`${breed.name} Expected Curve (${avgLife.toFixed(1)} yrs)`)
      .style('font-family', 'var(--font-sans)')
      .style('font-size', '0.6rem')
      .style('font-weight', 'bold')
      .attr('fill', '#1A1A1A')
      .attr('class', 'dark:fill-white');

    // National Average Legend
    legend
      .append('line')
      .attr('x1', 0)
      .attr('y1', 14)
      .attr('x2', 15)
      .attr('y2', 14)
      .attr('stroke', '#8A8680')
      .attr('stroke-width', '2')
      .attr('stroke-dasharray', '3,3');
    legend
      .append('text')
      .attr('x', 20)
      .attr('y', 18)
      .text(`National Avg (${sizeCategory} size class: ${nationalAvg.toFixed(1)} yrs)`)
      .style('font-family', 'var(--font-sans)')
      .style('font-size', '0.6rem')
      .style('font-weight', 'medium')
      .attr('fill', '#8A8680')
      .attr('class', 'dark:text-white/75');

    // Title label inside chart
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'middle')
      .text(`Biometric Vitality & Lifespan Curve Comparison`)
      .style('font-family', 'var(--font-sans)')
      .style('font-size', '0.75rem')
      .style('font-weight', '800')
      .attr('fill', '#1A1A1A')
      .attr('class', 'dark:fill-white');

  }, [breed, currentAge]);

  return (
    <div className="relative w-full h-full min-h-[240px]">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
