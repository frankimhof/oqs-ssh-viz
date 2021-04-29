import {PlotDimensions, TickType} from './customTypes';

type GridLineProps = {
  plotDimensions: PlotDimensions
  lineColor?: string,
  axis: "x"|"y",
  scale: d3.ScaleLinear<number, number>,
}

const GridLine : React.FC<GridLineProps> = ({axis, plotDimensions, scale, lineColor="lightgray"}) =>{
  const {boundedHeight, boundedWidth} = plotDimensions;
  
  const ticks: TickType[] = scale.ticks()
    .map((value)=>({
      value,
      offset: scale(value)
    } as TickType))

  return(
    <>
      {axis==="x" && ticks.map(({value, offset})=>(
        <g key={value} transform={`translate(${offset}, ${boundedHeight})`}>
          <line y2={boundedWidth} stroke={lineColor}/> 
        </g>
      ))}
      {axis==="y" && ticks.map(({value, offset})=>(
        <g key={value} transform={`translate(0, ${boundedHeight-offset})`}>
          <line x2={boundedWidth} stroke={lineColor}/> 
        </g>
      ))}
    </>
  )
}

export default GridLine;
