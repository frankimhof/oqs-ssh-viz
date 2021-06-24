# visualization of oqs-ssh measurments
This project is meant for visualizing the results obtained from running the benchmark scripts in [fhnw-ise-qcrypt/oqs-demos/openssh/benachmark](https://github.com/fhnw-ise-qcrypt/oqs-demos/tree/benchmark/openssh/benchmark).
It will display the results in a bar plot, whose appearance is customizable by double clicking on it.

# Prerequisites
1. Run the benachmark scripts as described in [fhnw-ise-qcrypt/oqs-demos/openssh/benchmark](https://github.com/fhnw-ise-qcrypt/oqs-demos/tree/benchmark/openssh/benchmark) in order to obtain the results as .csv files. The files will be stored in the `oqs-demos/openssh/benchmark/measurements` folder.
2. Install [node.js](https://nodejs.org/en/download/)

# Installation
Change into `/oqs-demos/openssh/benchmark` directory and run the following command to download the visualization software.
```
git clone --depth 1 --branch main https://github.com/frankimhof/oqs-ssh-viz.git
```

# Usage
1. Change into `/oqs-ssh-viz` and run the `visualize.sh` script to visualize the test results

```
./visualize.sh
```
2. The script will prompt to select which of the measurements should be visualized (in case the benchmark script was run multiple times). Select by entering the corresponding number and hit enter.
3. If successfull, the script will start a server on [http://localhost:5000](http://localhost:5000) where the bar plot is displayed.
4. Customize the bar plot by double clicking on it and selecting from options.

# Development
If you wish to further develop the bar plot, you are welcome to do so. The bar plot was built using [react.js](https://reactjs.org/) and [d3.js](https://d3js.org/). Therefore, after having installed the dependencies, you can utilize the available react scripts to run and build your changes.

## Install dependencies
Assuming current working directory is `/oqs-demos/openssh/benchmark/oqs-ssh-viz`

```
npm install
```

## Starting development server
```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Building
```
npm run build
```
Builds the app for production to the `build` folder, which is the folder that is being served when running ```visualize.sh```.
