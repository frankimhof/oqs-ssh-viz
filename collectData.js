const fs = require('fs');
const util = require('util');

const currentPath = process.argv[1].replace('collectData.js', '');
const pathToCSVFolder = `${currentPath}../${process.argv.slice(-1)[0]}`;
//create 1 json file which contains all data from all RTT
//[ {
//    index,
//    kemName,
//    sigName,
//    kemTime,
//    authTime,
//    hsTime
//  }, ...]
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

fs.readdir(pathToCSVFolder, async (err, data)=>{
  if(err){
    throw err
  }
  else{
    //we only want the .csv files
    console.log("================================================================================");
    console.log("Reading data from CSV files...") 
    const csvFileNames = data.filter(fileName=>fileName.match(".csv"))
    console.log(csvFileNames)
    const allData = await Promise.all(csvFileNames.map(async fn=>{
      const dataFromFile = await createObjectFromCSVFile(`${pathToCSVFolder}${fn}`, fn);
      return dataFromFile
    }))
    console.log("================================================================================");
    console.log("Writing json data to data.json") 
    await writeFile(`${currentPath}/build/data.json`, JSON.stringify(allData, null, 4))
  }
})

const createObjectFromCSVFile = async (pathToCSVFile,filename) => {
  const dataFromFile = await readFile(pathToCSVFile, 'utf8')
  const kemName = filename.split('_')[1];
  const sigName = filename.split('_')[2].split('.csv')[0];
  const reducedData = dataFromFile
      .split(/\r?\n/)// split file by lines
      .slice(1, -1)//remove first line, which contains only names
      .map(line => line.split(',').slice(-3))// keep only the last three values (Kex time, auth time and hs time)
  const allKexTimes = reducedData.map(values => parseFloat(values[0]))
  const allAuthTimes = reducedData.map(values => parseFloat(values[1]))
  const allHsTimes = reducedData.map(values => parseFloat(values[2]))
  //return reducedData;
  return {
    kemName,
    sigName,
    kemTimeMedian: median(allKexTimes),
    authTimeMedian: median(allAuthTimes),
    hsTimeMedian: median(allHsTimes),
    kemTime95th: percentile95(allKexTimes),
    authTime95th: percentile95(allAuthTimes),
    hsTime95th: percentile95(allHsTimes),
  }
}

const median = (arrayOfNumbers) => {
  const ordinalRank = Math.ceil(0.5*arrayOfNumbers.length);
  const sorted = arrayOfNumbers.sort((a, b)=>a-b, 0)
  return sorted[ordinalRank]
};

const percentile95 = (arrayOfNumbers) => {
  const ordinalRank = Math.ceil(0.95*arrayOfNumbers.length);
  const sorted = arrayOfNumbers.sort((a,b)=>a-b);
  return sorted[ordinalRank]
}

const mean = (arrayOfNumbers) => {
  return arrayOfNumbers.reduce((accum, current)=>accum+current, 0)/arrayOfNumbers.length
}

const pop_variance = (arrayOfNumbers, mean) => {
  return arrayOfNumbers.reduce((accum, current)=>accum+Math.pow(current-mean, 2), 0)/arrayOfNumbers.length
}
//createObjectFromCSVFile('./kyber512_5p560ms.csv');
