import React from 'react';
import {PlotDimensions} from './customTypes';

type Props = {
  titleFontSize?:number,
  plotDimensions: PlotDimensions
}

const Title: React.FC<Props> = ({plotDimensions, titleFontSize=30, children}) =>{
  const {marginLeft, boundedWidth} = plotDimensions;
  return(
    <text transform={`translate(${marginLeft+0.5*boundedWidth}, 50)`} fontSize={titleFontSize} fontWeight="regular" dominantBaseline="hanging" textAnchor="middle" >{children}</text>
  );
}

export default Title;
