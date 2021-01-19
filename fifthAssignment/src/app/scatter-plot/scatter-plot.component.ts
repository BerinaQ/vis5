import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit {

  private europeSpecificData = [];
  private svg;
  private margin = 50;
  private width = 650;
  private height = 300;
  private data = []

  constructor() {
  }

  ngOnInit(): void {
    this.createSvg();
    this.drawPlot();

    Promise.all([d3.csv('./assets/data/owid-covid-data.csv')]).then((data: any) => {
      data[0].forEach(item => {
        if (item.continent === 'Europe') {
          this.europeSpecificData.push(item);
        }
        data.new_cases = +data.new_cases
        data.population = +data.population
      });
      console.log('Data has been loaded');
    }).catch(error => {
      console.log('Something wrong while trying to read data');
    });
  }

  private createSvg(): void {
    this.svg = d3.select('figure#scatter')
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    // Add X axis
    const x = d3.scaleLinear()
      .domain([2019, 2021])
      .range([0, this.width]);
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 2410462])
      .range([this.height, 0]);

    this.svg.append('g')
      .call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append('g');
    dots.selectAll('dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.population))
      .attr('cy', d => y(d.new_cases))
      .attr('r', 7)
      .style('opacity', .5)
      .style('fill', '#69b3a2');

    // Add labels
    dots.selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .text(d => d.Framework)
      .attr('x', d => x(d.population))
      .attr('y', d => y(d.new_cases));

  }
}
