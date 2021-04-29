type DataEntry = {
  sigName:string,
  kemName:string,
  hsTimeMedian:number,
  kemTimeMedian:number,
  authTimeMedian:number,
  hsTime95th:number,
  kemTime95th:number,
  authTime95th:number,
}

type TickType = {
  value: number,
  offset: number,
}

type PlotDimensions = {
  width: number,
  height: number,
  boundedWidth: number,
  boundedHeight: number,
  marginLeft: number,
  marginRight: number,
  marginTop: number,
  marginBottom: number,
}

type LegendItem = {
  label: string,
  color: string,
  pattern?: string
}

export type {DataEntry, PlotDimensions, TickType, LegendItem}
