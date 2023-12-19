# Minesweeper Highlight

## Import
Import [mshl.js](https://magkms.github.io/minesweeper-highlight/mshl.js) to your project

## Start
```js
let options = {
  showChance: true; // show value of chance find mine or not
}

const mshl = new MinesweeperHL(options);

let width = 20, height = 20, cellSize = 20;
// width, height - amount of cells
// cellSize (optional) - size of cell in pixels

const canvas = mshl.init(width, height, cellSize); 

let mines = [{x: 0, y: 0, z: 1}];
// mines - array of cell values
// x,y - coords, z - value (0 - 8)

mshl.setMine (mines);

// use object `canvas` in your document

```

## Settings
You can change the settings or stay it default
```js
// use after init()

with mshl.settings {
  width = 20; // readonly
  height = 20; // readonly
  cellSize = 20; // readonly
  mineColor = 'red'; // color of cell with mine
  freeColor = 'green'; // color of free cell
  targetColor = 'lime'; // target cell opens many free cells
  textColor = 'black';
  mineOpacity = 0.5;
  freeOpacity = 0.5;
  textOpacity = 1;
  fontsize = 14; // in pixels
}
```
