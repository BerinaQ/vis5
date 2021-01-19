import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.css']
})
export class ChoroplethMapComponent implements OnInit {
  private svg;
  public title = 'Density of tests performed with respect to the population';
  constructor() { }

  ngOnInit(): void {  
    this.subscribeForScatterPlotChanges();
    this.initMap();
  }

  private subscribeForScatterPlotChanges() {

  }

  initMap(): void {
    const projection = d3.geoMercator()
      .center([33, 58]) // put focus/zoom on Europe countries
      /*.center([23, 5]) // put focus/zoom on Europe countries*/ // africa
      .translate([400, 300])
      .scale([600 / 1.5]);

    // Define path generator
    let path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
      .projection(projection);          // tell path generator to use get mercator projection wit focus on EU

    //Create SVG element and append map to the SVG
    this.svg = d3.select('.map-container')
      .append('svg')
      .attr('class', 'geoMap')
      .attr('width', 800)
      .attr('height', 600);

    // listen for click events outside the map and deselect previously selected county
    // const svgEl = document.querySelector('.geoMap');
    // svgEl.addEventListener('click', (e: any) => {
    //   if (e.toElement.localName === 'svg') {
    //     this.updateMapSelectedCountry('null');
    //   }
    // })

    // Load in my states data!
    d3.json('./assets/data/eu-states-geo.json').then(json => {
      this.svg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', '#fff')
        .style('stroke-width', '1')
        .style('fill', function (d) {
          return 'rgb(213,222,217)';
        })
        // .on('click', singleCountryData => {
        //   this.onMouseActionClick(singleCountryData);
        // });
    });
  }
}
