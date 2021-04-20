import React, {useState, useEffect, Component} from 'react';
import Select, {OptionsType} from 'react-select';
import './App.css';
import Plot from './Plot';
import {DataEntry} from './customTypes';

function App() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [useFilter, setShowFilter] = useState(false);
  const [selectedKems, setSelectedKems] = useState<string[]>([]);
  const [selectedSigs, setSelectedSigs] = useState<string[]>([]);

  const filteredData = data.filter(d=>selectedSigs.includes(d.sigName) && selectedKems.includes(d.kemName)) 
  const allAvailableKems = Array.from(new Set(data.map(d => d.kemName)))
  const allAvailableSigs = Array.from(new Set(data.map(d => d.sigName)))

  useEffect(()=>{
    const fetchData = async () =>{
      const response = await fetch('data.json');
      const dataFromResponse = await response.json();
      setData(dataFromResponse as DataEntry[])
    }
    fetchData();
  },[])

  const handleUseFilter = () =>{
    if(useFilter){
      setSelectedKems(allAvailableKems);
      setSelectedSigs(allAvailableSigs);
    }
    else{
      setSelectedKems([]);
      setSelectedSigs([]);
    }
    setShowFilter(!useFilter);
  };

  const handleSigFilterChange = (selectedOptions:OptionsType<{ value: string; label: string; }>) =>{
    setSelectedSigs(selectedOptions.map(d=>d.value))
  }

  const handleKemFilterChange = (selectedOptions:OptionsType<{ value: string; label: string; }>) =>{
    setSelectedKems(selectedOptions.map(d=>d.value))
  }

  

  return (
    <div className="App">
      <header className="App-header">
        <p>
        Openssh Speed Test Results
        </p>
      </header>
        <button onClick={handleUseFilter}>{useFilter? "Disable Filter":"Enable Filter"}</button>
      {useFilter && 
      <div style={{padding: "20px", backgroundColor: "#eee"}}>
        <h4>Select from available SIGs</h4>
        <Select onChange={handleSigFilterChange} options={allAvailableSigs.map(sig=>({value: sig, label: sig}))} isMulti/>
        <h4>Select from available KEMs</h4>
        <Select onChange={handleKemFilterChange} options={allAvailableKems.map(kem=>({value: kem, label: kem}))} isMulti/>
      </div>
      }
      <div className="App-body">
        <Plot xAccessor={(d:DataEntry):string=>d.kemName} yAccessors={[(d:DataEntry):number=>d.hsTimeMedian, (d:DataEntry):number=>d.hsTime95th]} data={useFilter? filteredData:data}></Plot>
      </div>
  </div>
  );
}

export default App;
