import React from 'react';
import {LegendItem, PlotDimensions} from './customTypes';

type Props = {
  items: LegendItem[],
  plotDimensions: PlotDimensions,
  legendFontSize: number,
  marginTop?: number,
  marginLeft?: number,
}

const Legend: React.FC<Props> = ({items, plotDimensions, legendFontSize=30, marginTop=50, marginLeft=30}) =>{
  return(
    <>
    {items.map((item, index)=>(
      <g transform={`translate(${plotDimensions.marginLeft+marginLeft}, ${index*legendFontSize+marginTop})`}>
        <rect 
          transform={`translate(0, 0)`}
          height={legendFontSize-10}
          fill={item.color}
          width={40}
          rx={2}>
        </rect>
        <rect 
          transform={`translate(0, 0)`}
          height={legendFontSize-10}
          fill={`url(#${item.pattern})`}
          width={40}
          rx={2}>
        </rect>
          <text transform={`translate(50, 0)`} dominantBaseline={"hanging"} fontSize={legendFontSize}>{item.label}</text>
      </g>
    ))}
    </>
  );
}

export default Legend;
