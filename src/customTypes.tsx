type DataEntry = {
  rtt: number,
  kemName: string,
  sigName: string,
  size1kb_median_ms: number,
  size10kb_median_ms: number,
  size100kb_median_ms: number,
  size1000kb_median_ms: number,
  size1kb_percent95_ms: number,
  size10kb_percent95_ms: number,
  size100kb_percent95_ms: number,
  size1000kb_percent95_ms: number,
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
