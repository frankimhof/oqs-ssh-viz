import React from 'react';
import * as d3 from 'd3';
import {PlotDimensions, DataEntry, LegendItem} from './customTypes';
import Axes from './Axes';
import GridLine from './GridLine';
import Legend from './Legend';

type Props = {
  title: string,
  data: DataEntry[],
  xAccessor: (d:DataEntry)=>string,
  yAccessors: ((d:DataEntry)=>number)[],
  legend: LegendItem[],
  xGridLine?: boolean,
  yGridLine?: boolean,
  barGroupSpacing?: number,
  barSpacing?: number,
}

const createDimensions = (width:number, height: number, marginLeft: number, marginRight: number, marginTop:number, marginBottom: number):PlotDimensions => {
  return {
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    boundedWidth:width-marginLeft-marginRight,
    boundedHeight:height-marginTop-marginBottom,
  }
}


const BarPlot: React.FC<Props> = ({title, data, xAccessor, yAccessors, legend, yGridLine=true, barSpacing=1, barGroupSpacing=5}) =>{
  const plotDimensions:PlotDimensions = createDimensions(1600, 900, 150, 10, legend.length*20+20, 400);
  const {width, height, boundedHeight, boundedWidth, marginTop, marginLeft} = plotDimensions;
  const entryWidth = boundedWidth/data.length;//The max width for each DataEntry. 
  const numberOfBarsPerGroup = yAccessors.length;
  const barWidth = (entryWidth-barGroupSpacing-(numberOfBarsPerGroup-1)*barSpacing)/numberOfBarsPerGroup;//split maxBarWidth evenly between the bars if there is more than one. 

  //get the extents of all data that will be shown and use the biggest to scale the entire visualization
  const accessorWithBiggestExtent = yAccessors.reduce((current, next) => ((d3.extent(data, next))[1] as number)>((d3.extent(data, current))[1] as number)? next:current, yAccessors[0])
  const yScale:d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .domain([0, (d3.extent(data, accessorWithBiggestExtent)[1] as number)])//toDo: make domain parameterizable [0+offsetBottom, extent+offsetTop]
    .range([0, plotDimensions.boundedHeight])
    .nice()


  //the svg patterns had to be added to /public/index.html
  return(
    <div className="plot">
      <svg style={{backgroundColor: "#fff", borderRadius: "5px"}} width={width} height={height}>
        <g transform={`translate(${marginLeft+0.5*boundedWidth}, ${marginTop*0.25})`}>
          <text fontSize="25px" fontWeight="bold" textAnchor="middle" >{title}</text>
        </g>
        <Legend items={legend} plotDimensions={plotDimensions}/>
        <g transform={`translate(${marginLeft}, ${marginTop})`}>
          <Axes yScale={yScale} plotDimensions={plotDimensions} lineColor={"black"} yLabel={"[s]"}/>
          {yGridLine && <GridLine axis="y" scale={yScale} plotDimensions={plotDimensions}/>}
          {data.map((d, index)=>{
            return(
              <g transform={`translate(${index/data.length*boundedWidth}, 0)`} key={index}>
                <g transform={`translate(${barGroupSpacing*0.5}, 0)`}>
                  {yAccessors.map((yAcc, barIndex)=>(
                  <>
                    <rect 
                      transform={`translate(${barIndex*barWidth+barIndex*barSpacing}, ${boundedHeight-yScale(yAcc(d))})`}
                      height={yScale(yAcc(d))}
                      style={{fill: `${legend[barIndex].color}`}}
                      width={barWidth} rx={2}>
                    </rect>
                    <rect 
                      transform={`translate(${barIndex*barWidth+barIndex*barSpacing}, ${boundedHeight-yScale(yAcc(d))})`}
                      height={yScale(yAcc(d))}
                      style={{fill: `url(#${legend[barIndex].pattern})`}}
                      width={barWidth} rx={2}>
                    </rect>
                  </>)
                  )}
                </g>
                <text style={{fill: "black", transformOrigin: "top left", transform: `translate(${entryWidth*0.5}px, ${boundedHeight+15}px) rotate(-60deg)`, fontSize: "16px", textAnchor: "end"}}>{xAccessor(d)}</text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  );
}
export default BarPlot;
