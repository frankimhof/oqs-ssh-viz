import React, {useState, useEffect} from 'react';
import Select, {OptionsType} from 'react-select';
import * as d3 from 'd3';
import './App.css';
import BarPlot from './BarPlot';
import {DataEntry, LegendItem} from './customTypes';

function App() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [barSpacing, setBarSpacing] = useState<number>(2);
  const [barGroupSpacing, setBarGroupSpacing] = useState<number>(20);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedKems, setSelectedKems] = useState<string[]>([]);
  const [selectedSigs, setSelectedSigs] = useState<string[]>([]);
  const allAvailableKems = Array.from(new Set(data.map(d => d.kemName)))
  const allAvailableSigs = Array.from(new Set(data.map(d => d.sigName)))
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [sortByKem, setSortByKem] = useState<boolean>(true);//if set to false, displayed names will be sorted by sigName
  const allAvailableValueAccessors = [
    {
      label:"1kb page size",
      accessor: (d:DataEntry)=>d.size1kb_median_ms,
      color: "#648fff",
      pattern: ""
    },
    {
      label:"10kb page size",
      accessor: (d:DataEntry)=>d.size10kb_median_ms,
      color: d3.rgb("#648fff").brighter(1).toString(),
      pattern: "diagonal-lines"
    },
    {
      label:"100kb page size",
      accessor: (d:DataEntry)=>d.size100kb_median_ms,
      color: "#dc267f",
      pattern: ""
    },
    {
      label:"1000kb page size",
      accessor: (d:DataEntry)=>d.size1000kb_median_ms,
      color: d3.rgb("#dc267f").brighter(2).toString(),
      pattern: "checkered"
    },
//    {
//      label:"1000kb median",
//      accessor: (d:DataEntry)=>d.size100kb_median_ms,
//      color: "#ffb002",
//      pattern: ""
//    },
//    {
//      label:"KemTime95thPercentile",
//      accessor: (d:DataEntry)=>d.size1000kb_median_ms,
//      color: d3.rgb("#ffb002").brighter(0.8).toString(),
//      pattern: "circles"
//    },
  ];

  const [selectedValueAccessors, setSelectedValueAccessors] = useState<{label: string, accessor: (d:DataEntry)=>number, color: string, pattern: string}[]>(allAvailableValueAccessors);

  useEffect(()=>{
    const fetchData = async () =>{
      const response = await fetch('data.json');
      const dataFromResponse = await response.json();
      setData(dataFromResponse as DataEntry[])
    }
    fetchData();
  },[])

  useEffect(()=>{
    setSelectedKems(Array.from(new Set(data.map(d => d.kemName))));
    setSelectedSigs(Array.from(new Set(data.map(d => d.sigName))));
  },[data])

  useEffect(()=>{
    setFilteredData(data.filter(d=>selectedSigs.includes(d.sigName) && selectedKems.includes(d.kemName)));
  }, [data, selectedKems, selectedSigs])

  const handleSigFilterChange = (selectedOptions:OptionsType<{ value: string; label: string; }>) =>{
    setSelectedSigs(selectedOptions.map(d=>d.value))
  }

  const handleKemFilterChange = (selectedOptions:OptionsType<{ value: string; label: string; }>) =>{
    setSelectedKems(selectedOptions.map(d=>d.value))
  }
  const handleValueAccessorChange = (selectedOptions:OptionsType<{ value: string; label: string; }>) =>{
    const selectedLabels = selectedOptions.map(o=>o.label);
    setSelectedValueAccessors(allAvailableValueAccessors.filter(d=>selectedLabels.includes(d.label)))
  }

  

  return (
    <div className="App">
      <header className="App-header">
      </header>
        <div onDoubleClick={()=>setShowSettings(!showSettings)} className="App-body">
        {showSettings && 
          <>
          <div style={{position: "fixed", top: 0, left: 0, bottom: 0, right: 0, overflow: "auto", background: "rgba(0,0,0,0.9)"}}/>
          <div style={{position: "absolute", padding: "20px", backgroundColor: "transparent"}}>
            <h4>Values</h4>
              <Select value={selectedValueAccessors.map(a=>({value: a.label, label: a.label}))} onChange={handleValueAccessorChange} options={allAvailableValueAccessors.map(a=>({value: a.label, label: a.label}))} isMulti/>
            <h4>SIGs</h4>
              <Select value={selectedSigs.map(sig=>({value: sig, label: sig}))} onChange={handleSigFilterChange} options={allAvailableSigs.map(sig=>({value: sig, label: sig}))} isMulti/>
            <h4>KEMs</h4>
              <Select value={selectedKems.map(kem=>({value: kem, label: kem}))} onChange={handleKemFilterChange} options={allAvailableKems.map(kem=>({value: kem, label: kem}))} isMulti/>
            <h4>Bar Spacing</h4>
              <input style={{display: "block"}} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setBarSpacing(Number(e.target.value))} value={barSpacing} type="number"/>
            <h4>Bar Group Spacing</h4>
            <input style={{display: "block"}} value={barGroupSpacing} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setBarGroupSpacing(Number(e.target.value))} type="number"/>
            <h4>Sort by</h4>
            <div style={{display: "flex", flexDirection: "row"}}>
              <button onClick={()=>setSortByKem(!sortByKem)}>{sortByKem? "KEM name":"SIG name"}</button>
            </div>
          </div>
          </>
        }
        <BarPlot 
          title={"PQ-TLS: Median Web Page Retrieval Time"}
          subtitle={`RTT: ${filteredData[0]? filteredData[0].rtt : "undefined"} ms`}
          xAccessor={(d:DataEntry):string=>(d.kemName)} 
          yAccessors={selectedValueAccessors.map(a=>a.accessor)}
          legend={selectedValueAccessors.map(({label, color, pattern})=>({label, color, pattern} as LegendItem))}
          data={sortByKem? filteredData.sort((a, b)=>a.kemName>b.kemName? 1:0) : filteredData.sort((a, b)=>a.sigName>b.sigName? 1:0)}//todo: nonmutating sort
          barSpacing={barSpacing}
          barGroupSpacing={barGroupSpacing}
        >
        </BarPlot>
      </div>
  </div>
  );
}

export default App;
