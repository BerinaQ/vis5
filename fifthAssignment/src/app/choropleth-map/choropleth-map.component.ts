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
    this.subscribeForScatterPlotChanges();

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


    // this.determineColorFor();
  }

  // tslint:disable-next-line:typedef
  private subscribeForScatterPlotChanges() {

  }

  initMap(): void {

    const projection = d3.geoMercator()
      .center([33, 58]) // put focus/zoom on Europe countries
      .translate([400, 300])
      .scale([600 / 1.5]);

    // Define path generator
    const path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
      .projection(projection);          // tell path generator to use get mercator projection wit focus on EU

    // Create SVG element and append map to the SVG
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
        .style('fill', (d) => {
          const totalCasesForCountry = this.getTotalCasesForCountry(d.properties.name);
          return this.determineColorFor(totalCasesForCountry);
        });
      // .on('click', singleCountryData => {
      //   this.onMouseActionClick(singleCountryData);
      // });
    });
  }

  // tslint:disable-next-line:typedef
  private getTotalCasesForCountry(countryName: string) {
    let totalCases = 0;

    this.dataLoaded.forEach(row => {
      if (row.location === countryName) {
        totalCases = row.total_cases;
      }
    });

    return totalCases;
  }

  // tslint:disable-next-line:typedef
  private determineColorFor(infectedPeople: number) {
    const maxInfected = 2410462;
    if (infectedPeople <= maxInfected / 8) {
      return '#ef9a9a';
    }else if (infectedPeople >= maxInfected / 8 && infectedPeople <=maxInfected / 7) {
      return '#e57373';//'#5698b9';
    } else if (infectedPeople >= maxInfected / 7 && infectedPeople <=maxInfected / 6) {
      return '#ef5350';//'#5698b9';
    } else if (infectedPeople >= maxInfected / 6 && infectedPeople <=maxInfected / 5) {
      return '#f44336';//'#5698b9';
    } else if (infectedPeople >= maxInfected / 5 && infectedPeople <=maxInfected / 4) {
      return  '#e53935';//'#be64ac';
    } else if (infectedPeople > maxInfected / 4 && infectedPeople <=maxInfected / 3) {
      return '#d32f2f';//'#8c62aa';
    } else if (infectedPeople > maxInfected / 3 && infectedPeople <=maxInfected / 2){
      return '#c62828';//'#3b4994';
    } else{
      return '#b71c1c';
    }
  }
}
