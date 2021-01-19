import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.css']
})

export class ChoroplethMapComponent implements OnInit {
  private svg;
  private dataLoaded = [];

  constructor() {
  }

  ngOnInit(): void {

    Promise.all([d3.csv('./assets/data/owid-covid-data.csv')]).then((data: any) => {
      data[0].forEach(item => {
        if (item.continent === 'Europe') {
          this.dataLoaded.push(item);
        }
      });
      console.log('Data has been loaded, so we can start drawing map.');
      this.initMap();
    }).catch(error => {
      console.log('Something wrong while trying to read data');
    });

  }

  initMap(): void {

    const projection = d3.geoMercator()
      .center([33, 58])
      .translate([400, 300])
      .scale([600 / 1.5]);

    const path = d3.geoPath()
      .projection(projection);

    this.svg = d3.select('.map-container')
      .append('svg')
      .attr('class', 'geoMap')
      .attr('width', 800)
      .attr('height', 600);

    d3.json('./assets/data/eu-states-geo.json').then(json => {
      this.svg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', '#fff')
        .style('stroke-width', '1')
        .style('fill', (d) => {
          const totalCasesForCountry = this.getTotalCasesForCountry(d.properties.name);
          return ChoroplethMapComponent.determineColorFor(totalCasesForCountry);
        });
    });
  }

  private getTotalCasesForCountry(countryName: string) {
    let totalCases = 0;

    this.dataLoaded.forEach(row => {
      if (row.location === countryName) {
        totalCases = row.total_cases;
      }
    });

    return totalCases;
  }

  private static determineColorFor(infectedPeople: number) {
    const maxInfected = 2410462;
    if (infectedPeople <= maxInfected / 4) {
      return '#ef9a9a';
    } else if (infectedPeople >= maxInfected / 4 && infectedPeople <=maxInfected / 3) {
      return '#e57373';
    } else if (infectedPeople > maxInfected / 3 && infectedPeople <=maxInfected / 2) {
      return '#f44336';
    } else{
      return '#b71c1c';
    }
  }
}
