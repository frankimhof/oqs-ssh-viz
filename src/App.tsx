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
  const allAvailableValueAccessors = [
    {
      label:"Handshake Time Median",
      accessor: (d:DataEntry)=>d.hsTimeMedian,
      color: "#648fff",
      pattern: ""
    },
    {
      label:"Handshake Time 95th Percentile",
      accessor: (d:DataEntry)=>d.hsTime95th,
      color: d3.rgb("#648fff").brighter(1).formatHex(),
      pattern: ""
      //pattern: "diagonal-lines"
    },
    {
      label:"Client Auth Time Median",
      accessor: (d:DataEntry)=>d.authTimeMedian,
      color: "#dc267f",
      pattern: ""
    },
    {
      label:"Client Auth Time 95th Percentile",
      accessor: (d:DataEntry)=>d.authTime95th,
      color: d3.rgb("#dc267f").brighter(2).formatHex(),
      pattern: ""
      //pattern: "checkered"
    },
    {
      label:"Kem Time Median",
      accessor: (d:DataEntry)=>d.kemTimeMedian,
      color: "#ffb002",
      pattern: ""
    },
    {
      label:"Kem Time 95th Percentile",
      accessor: (d:DataEntry)=>d.kemTime95th,
      //color: "#648fff",
      color: d3.rgb("#ffb002").brighter(0.8).formatHex(),
      pattern: ""
      //pattern: "circles"
    },
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
        <div className="App-body">
        {showSettings && 
          <>
          <div onDoubleClick={()=>setShowSettings(false)} style={{position: "fixed", top: 0, left: 0, bottom: 0, right: 0, overflow: "auto", background: "rgba(0,0,0,0.9)"}}/>
          <div style={{width: "50vw", position: "absolute", padding: "20px", backgroundColor: "transparent"}}>
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
            <h4>Bar Colors</h4>
              {selectedValueAccessors.map((a, index)=><input onInput={(e:React.ChangeEvent<HTMLInputElement>)=>setSelectedValueAccessors(selectedValueAccessors.map((v,i)=>i===index? Object.assign(v, {color: e.target.value}) : v ))} type="color" id={a.label} name={a.label} value={a.color.toString()}/>)}
          </div>
          </>
        }
        <div onDoubleClick={()=>setShowSettings(true)}>
        <BarPlot 
          title={"oqs-ssh handshake time results"}
          xAccessor={(d:DataEntry):string=>("( " + d.kemName+" ) ( "+d.sigName+" )")} 
          yAccessors={selectedValueAccessors.map(a=>a.accessor)}
          legend={selectedValueAccessors.map(({label, color, pattern})=>({label, color, pattern} as LegendItem))}
          data={filteredData}
          barSpacing={barSpacing}
          barGroupSpacing={barGroupSpacing}
        >
        </BarPlot>
        </div>
      </div>
  </div>
  );
}

export default App;
