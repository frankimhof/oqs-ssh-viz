import React from 'react';
import {PlotDimensions} from './customTypes';
import Ticks from './Ticks';

type Props = {
  plotDimensions: PlotDimensions
  lineColor: string,
  labelColor?: string,
  yLabel?: string,
  yLabelFontSize?: number,
  xLabelFontSize?: number,
  yTicksFontSize?: number,
  xTicksFontSize?: number,
  xLabel?: string,
  yScale?: d3.ScaleLinear<number, number>,
  xScale?: d3.ScaleLinear<number, number>,
}

type AxisLabelProps = {
  label:string,
  labelFontSize?:number,
  labelColor?: string,
  plotDimensions:PlotDimensions,
  axis: Axis,
}
type Axis = 'x' | 'y';

const AxisLabel:React.FC<AxisLabelProps> = ({axis, label, labelFontSize=30, labelColor="black", plotDimensions}) => {
  const {boundedWidth, boundedHeight, marginTop, marginLeft} = plotDimensions;
  return (
  <>
    {axis==="y" &&
      <g style={{transform:`rotate(-90deg)`}}>
        <text transform={`translate(${-boundedHeight*0.5}, ${-marginLeft*0.5})`} textAnchor={"middle"} fontSize={labelFontSize} fill={labelColor}>{label}</text>
      </g>
    }
    {axis==="x" &&
      <g transform={`translate(${boundedWidth*0.5}, ${boundedHeight+marginTop*0.6})`}>
        <text textAnchor={"middle"} fill={labelColor} fontSize={labelFontSize}>{label}</text>
      </g>
    }
  </>
)}


const Axes: React.FC<Props> = ({
    plotDimensions,
    xScale,
    yScale,
    lineColor="black",
    yLabel,
    xLabel,
    yLabelFontSize=30,
    xLabelFontSize=30,
    yTicksFontSize=30,
    xTicksFontSize=30,
    labelColor="black"
  }) => {
    const {boundedHeight, boundedWidth} = plotDimensions;

    return (
      <>
        <g>
          <line y2={boundedHeight} stroke={lineColor}/>
          <line y1={boundedHeight} y2={boundedHeight} x2={boundedWidth} stroke={lineColor}/>
          {yLabel && <AxisLabel axis={"y"} plotDimensions={plotDimensions} label={yLabel} labelColor={labelColor} labelFontSize={yLabelFontSize}/>}
          {xLabel && <AxisLabel axis={"x"} plotDimensions={plotDimensions} label={xLabel} labelColor={labelColor} labelFontSize={xLabelFontSize}/>}
          {yScale && <Ticks axis={"y"} plotDimensions={plotDimensions} scale={yScale} lineColor={lineColor} ticksFontSize={yTicksFontSize}/>}
          {xScale && <Ticks axis={"x"} plotDimensions={plotDimensions} scale={xScale} lineColor={lineColor} ticksFontSize={xTicksFontSize}/>}
        </g>
      </>
    )
}

export default Axes;
