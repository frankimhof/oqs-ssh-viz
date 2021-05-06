import React from 'react';
import {PlotDimensions} from './customTypes';

type Props = {
  titleFontSize?:number,
  plotDimensions: PlotDimensions
}

const Subtitle: React.FC<Props> = ({plotDimensions, titleFontSize=25, children}) =>{
  const {marginLeft, boundedWidth} = plotDimensions;
  return(
    <text transform={`translate(${marginLeft+0.5*boundedWidth}, 0)`} fontSize={titleFontSize} fontWeight="bold" dominantBaseline="hanging" textAnchor="middle" >{children}</text>
  );
}

export default Subtitle;
