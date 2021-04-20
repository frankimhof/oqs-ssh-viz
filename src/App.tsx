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
  //const data:DataEntry[] = dataJSON.map((d:any)=>d as DataEntry);
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
    console.log("HANDLE SIGS")
  }

  const handleKemFilterChange = (selectedOptions:OptionsType<{ value: string; label: string; }>) =>{
    setSelectedKems(selectedOptions.map(d=>d.value))
    console.log("HANDLE KEMS")
  }

  const allAvailableSigs:string[]=Array.from(new Set(data.map(d => d.sigName)))
  const allAvailableKems:string[]=Array.from(new Set(data.map(d => d.kemName)))
  const filteredData = data.filter(d=>selectedSigs.includes(d.sigName) && selectedKems.includes(d.kemName)) 

  return (
    <div className="App">
      <header className="App-header">
        <p>
        Openssh Speed Test Results
        </p>
      </header>
        <button onClick={handleUseFilter}>{useFilter? "Disable Filter":"Enable Filter"}</button>
      {useFilter && 
      <div>
        <Select onChange={handleSigFilterChange} options={allAvailableSigs.map(sig=>({value: sig, label: sig}))} isMulti/>
        <Select onChange={handleKemFilterChange} options={allAvailableKems.map(kem=>({value: kem, label: kem}))} isMulti/>
      </div>
      }
      <div className="App-body">
        <Plot data={filteredData}></Plot>
      </div>
  </div>
  );
}

export default App;
