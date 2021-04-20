import React, {useState, useEffect} from 'react';
import * as d3 from 'd3';
import {DataEntry} from './customTypes';

type TickType = {
  value: number,
  offset: number,
}

type Props = {
  data: DataEntry[],
  xAccessor: (d:DataEntry)=>string,
  yAccessors: ((d:DataEntry)=>number)[]
}

type BarGroupProps = {
  boundedWidth: number, 
  boundedHeight: number
}

//const PlotContext = React.createContext({
//  width: 1200,
//  height: 800,
//  marginLeft: 100,
//})

const Plot: React.FC<Props> = ({data, xAccessor, yAccessors}) =>{

  const width=1200;
  const height=800;
  const marginLeft=100;
  const marginRight=10;
  const marginTop=10;
  const marginBottom=300;
  const boundedWidth=width-marginLeft-marginRight;
  const boundedHeight=height-marginTop-marginBottom;
  const entryWidth = boundedWidth/data.length;//The max width for each DataEntry. 
  const numberOfBarsPerGroup = yAccessors.length;
  const gap = 5;//gap between each entry (which may consist of many bars)
  const barGap = 0;//gap between bars
  const barWidth = (entryWidth-gap)/numberOfBarsPerGroup;//split maxBarWidth evenly between the bars if there is more than one. 

  //get the extents of all data that will be shown and use the biggest to scale the entire visualization
  const accessorWithBiggestExtent = yAccessors.reduce((current, next) => ((d3.extent(data, next))[1] as number)>((d3.extent(data, current))[1] as number)? next:current, yAccessors[0])
  const yScale:d3.ScaleLinear<number, number> = d3.scaleLinear().domain([1.6, (d3.extent(data, accessorWithBiggestExtent) as [number, number])[1]])
    .range([0, boundedHeight-20])
    .nice()

  const Labels = ({xLabel, yLabel}:{xLabel: String, yLabel: String}) => {
    const labelColor="black";

    return (
    <>
      <g style={{transform:`rotate(-90deg)`}}>
        <text transform={`translate(${-boundedHeight*0.5}, ${-marginLeft*0.6})`} textAnchor={"middle"} fontSize={25} fill={labelColor}>{yLabel}</text>
      </g>
      <g transform={`translate(${boundedWidth*0.5}, ${boundedHeight+marginTop*0.6})`}>
        <text textAnchor={"middle"} fill={labelColor} fontSize={20}>{xLabel}</text>
      </g>
    </>
  )}

  const Axes = ({yTicks}:{yTicks:TickType[]}) => {
    const axesColor="black";
    const tickLabelFontSize = "20px";
    return (
    <>
      <g>
        <line y2={boundedHeight} stroke={axesColor}/>
        {yTicks.map(({value, offset})=>(
          <g key={value} transform={`translate(0, ${boundedHeight-offset})`}>
            <line x2="-6" stroke={axesColor}/> 
            <line x2={boundedWidth} stroke={"lightgray"}/> 
            <text key={value} style={{fontSize: tickLabelFontSize, fill: `${axesColor}`, textAnchor:"end", transform: "translate(-10px,2px)"}}>{value}</text>
          </g>
        ))}
        <line y1={boundedHeight} y2={boundedHeight} x2={boundedWidth} stroke={axesColor}/>
      </g>
    </>
  )};

  const yTicks:TickType[] = yScale.ticks().map((value)=>({
      value,
      offset: yScale(value)
    } as TickType
  ))

  const Bars: React.FC<BarGroupProps> = ({boundedHeight, boundedWidth}) =>{
    return (
      <>
        {data.map((d, index)=>{
          return(
            <g transform={`translate(${index/data.length*boundedWidth}, 0)`} key={index}>
              <g transform={`translate(${gap*0.5}, 0)`}>
                {yAccessors.map((yAcc, barIndex)=><rect transform={`translate(${barIndex*barWidth+barIndex*barGap}, ${boundedHeight-yScale(yAcc(d))})`} height={yScale(yAcc(d))} style={{fill:"red"}} width={barWidth} rx={5}></rect>)}
              </g>
              <text style={{fill: "black", transformOrigin: "top left", transform: `translate(${entryWidth*0.5}px, ${boundedHeight+15}px) rotate(-60deg)`, fontSize: "20px", fontWeight: "bold", textAnchor: "end"}}>{xAccessor(d)}</text>
            </g>
          )
        })}
      </>
    )
  }

  return(
    <div className="plot">
      <svg style={{backgroundColor: "#fff", borderRadius: "5px"}} width={width} height={height}>
        <g transform={`translate(${marginLeft}, ${marginTop})`}>
          <Axes yTicks={yTicks}/>
          <Labels yLabel={"Handshake Times [s]"} xLabel={""}/>
          <Legend/>
          <Bars boundedWidth={boundedWidth} boundedHeight={boundedHeight}></Bars>
        </g>
      </svg>
    </div>
  );
}
export default Plot;
