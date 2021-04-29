import React from 'react';
import {LegendItem, PlotDimensions} from './customTypes';

type Props = {
  items: LegendItem[],
  plotDimensions: PlotDimensions
}

const Legend: React.FC<Props> = ({items, plotDimensions}) =>{
  return(
    <>
    {items.map((item, index)=>(
      <g transform={`translate(${plotDimensions.marginLeft}, 10)`}>
        <rect 
          transform={`translate(${0}, ${index*20})`}
          height={10}
          style={{fill: `${item.color}`}}
          width={30} rx={2}>
        </rect>
        <rect 
          transform={`translate(${0}, ${index*20})`}
          height={10}
          style={{fill: `url(#${item.pattern})`}}
          width={30} rx={2}>
        </rect>
        <g transform={`translate(40, ${10+index*20})`}>
          <text>{item.label}</text>
        </g>
      </g>
    ))}
    </>
  );
}

export default Legend;
