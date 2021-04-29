import {PlotDimensions, TickType} from './customTypes';

type TickProps = {
  plotDimensions: PlotDimensions
  lineColor: string,
  axis: "x"|"y",
  scale: d3.ScaleLinear<number, number>,
}

const Ticks: React.FC<TickProps> = ({axis, plotDimensions, scale, lineColor}) =>{
  const {boundedHeight} = plotDimensions;
  const tickLabelFontSize = "20px";
  
  const ticks: TickType[] = scale.ticks()
    .map((value)=>({
      value,
      offset: scale(value)
    } as TickType))

  return(
    <>
      {axis==="x" && ticks.map(({value, offset})=>(
        <g key={value} transform={`translate(${offset}, ${boundedHeight})`}>
          <line y2="6" stroke={"red"}/> 
          <text key={value} style={{fontSize: tickLabelFontSize, fill: `${lineColor}`, textAnchor:"middle", transform: `translate(0px, 30px)`}}>{value}</text>
        </g>
      ))}
      {axis==="y" && ticks.map(({value, offset})=>(
        <g key={value} transform={`translate(0, ${boundedHeight-offset})`}>
          <line x2="-6" stroke={lineColor}/> 
          <text key={value} style={{fontSize: tickLabelFontSize, fill: `${lineColor}`, textAnchor:"end", transform: "translate(-10px,2px)"}}>{value}</text>
        </g>
      ))}
    </>
  )
}

export default Ticks
