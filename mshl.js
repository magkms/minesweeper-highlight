class MinesweeperHL {
    constructor(options) {
        this.showChance = options?.showChance ?? true;
        this.cvs = document.createElement('canvas');
        this.cvs.id = 'mshl_cvs';
        this.ctx = this.cvs.getContext('2d');
    }
    
    init(width, height, cellSize = 20) {
        if (!(Number.isInteger(width) && Number.isInteger(height) && Number.isInteger(cellSize))) throw 'init (Number width, Number height, optional Number cellSize)';
        
        this.cvs.width = width * cellSize;
        this.cvs.height = height * cellSize;
        
        this.mines = new Array(width).fill(0).map(()=>new Array(height));
this.chance = [];
        this.predict = new Array(width).fill(0).map(()=>new Array(height));
        
        this.settings = {width, height, cellSize, mineColor: 'red', freeColor: 'green', targetColor: 'lime', textColor: 'black', mineOpacity: 0.5, freeOpacity: 0.5, textOpacity: 1, fontsize: 14};
        this.ctx.font = this.settings.fontsize + 'px sans-serif';
        
        return this.cvs;
    }
    
    setMine(arr) {
        if (!Array.isArray(arr)) arr = [arr];
        if (!(typeof arr[0] == 'object' && Number.isInteger(arr[0].x))) throw 'setMine ( [ {x, y, z} ] )';
        if (this.mines == undefined) throw 'use init() first';
        
        let arrnew = [];
        arr.forEach(a=>{
            if (a.z != this.mines[a.x][a.y]) {
                this.mines[a.x][a.y] = a.z;
                arrnew.push(a);
            }
        })
        
        if (arrnew.length == 0) return;
        
        arr = [];
        arrnew.forEach(({x,y})=>{
            let left = x > 0 ? x-1 : 0, right = x < this.settings.width-1 ? x+1 : this.settings.width-1;
            let top = y > 0 ? y-1 : 0, bottom = y < this.settings.height-1 ? y+1 : this.settings.height-1;
            for (let i=left; i<=right; i++)
                for (let j=top; j<=bottom; j++)
                    arr.push({x:i,y:j,z:this.mines[i][j]});
        });
        arr.forEach(e=>checkMines.call(this,e));
        
        let chance = new Array(this.settings.width).fill(0).map(()=>new Array(this.settings.height).fill(0));
        // if (this.showChance) getChance();
        draw.call(this);

            
        function checkMines({x,y,z}) {
            if (z == 0 || z == 10 || z == undefined || this.predict[x][y] == -1) return;
            let u = 0, t = 0, p = 0; // u - undefined, unknown, t - ten, mine, p - predict, free
            let left = x > 0 ? x-1 : 0, right = x < this.settings.width-1 ? x+1 : this.settings.width-1;
            let top = y > 0 ? y-1 : 0, bottom = y < this.settings.height-1 ? y+1 : this.settings.height-1;
let topu = 0, bottomu = 0, leftu = 0, rightu = 0;
            let tocheck = [];
            
            for (let i = left; i<=right; i++)
                for (let j = top; j<=bottom; j++) {
                    if (this.mines[i][j] == undefined) {
                        if (this.predict[i][j] == 1) p++;
                        else {
                            u++;
if (i == left) leftu++;
if (i == right) rightu++;
if (j == top) topu++;
if (j == bottom) bottomu++;
                        }
                    }
                    if (this.mines[i][j] == 10) t++;
            }
            
if (x == left) leftu = 0;
if (x == right) rightu = 0;
if (y == top) topu = 0;
if (y == bottom) bottomu = 0;
            
            if (u+t == z) {
                this.predict[x][y] = -1;
                if (u == 0) return;
                console.log(`x=%d, y=%d, z=%d, u=%d, t=%d, p=%d`,x,y,z,u,t,p);
                for (let i = left; i<=right; i++)
                    for (let j = top; j<=bottom; j++) {
                        if (this.mines[i][j] == undefined && this.predict[i][j] != 1) {
                            this.mines[i][j] = 10; // mine
                            tocheck.push([i,j]);
                            console.log('mine in %dx%d',i,j);
                        }
                    }
            } else {
                let proc = (z-t) / u;
                for (let i = left; i<=right; i++)
                    for (let j = top; j<=bottom; j++) {
                        if (this.mines[i][j] == undefined) {
                            if (proc == 0) {
                                this.predict[i][j] = 1; // no mine
                                tocheck.push([i,j]);
                                console.log(`x=%d, y=%d, z=%d, u=%d, t=%d, p=%d`,x,y,z,u,t,p);
                                console.log('free in %dx%d',i,j);
                            }
                            if (this.predict[i][j] != 1) {
                                this.predict[i][j] = 0; // draw chance
                            }
                        }
                    }
                
            }
            if (tocheck.length) {
                tocheck.forEach(([xx,yy])=>{
                    let left = xx > 0 ? xx-1 : 0, right = xx < this.settings.width-1 ? xx+1 : this.settings.width-1;
                    let top = yy > 0 ? yy-1 : 0, bottom = yy < this.settings.height-1 ? yy+1 : this.settings.height-1;
                    for (let i=left; i<=right; i++)
                        for (let j=top; j<=bottom; j++) 
                            if (!(i == x && j == y)) checkMines.call(this,{x:i,y:j,z:this.mines[i][j]});
                })
            }
        }
        
        function draw(){
            this.ctx.clearRect(0,0,10000,10000);
            let w = this.settings.cellSize;
            for (let i = 0; i < this.settings.width; i++)
                for (let j = 0; j < this.settings.height; j++) {
                    if (this.mines[i][j] == 10) { // draw mine
                            this.ctx.globalAlpha = this.settings.mineOpacity;
                            this.ctx.fillStyle = this.settings.mineColor;
                            this.ctx.fillRect(i*w,j*w,w,w);
                    }
                    else if (this.mines[i][j] == undefined) {
                        if (this.predict[i][j] == 1) { // draw free
                                let t = 0, p = 0;
                                let left = i > 0 ? i-1 : 0, right = i < this.settings.width-1 ? i+1 : this.settings.width-1;
                                let top = j > 0 ? j-1 : 0, bottom = j < this.settings.height-1 ? j+1 : this.settings.height-1;
                                for (let x = left; x <= right; x++)
                                        for (let y = top; y <= bottom; y++) {
                                                if (this.mines[x][y] == 10) t=1;
                                                if (this.predict[x][y] == 1) p++;
                                        }
                                if (t == 0 && p > 1) {
                                    this.ctx.globalAlpha = this.settings.freeOpacity;
                                    this.ctx.fillStyle = this.settings.targetColor;
                                    this.ctx.fillRect(i*w,j*w,w,w);
                                } else {
                                    this.ctx.globalAlpha = this.settings.freeOpacity;
                                    this.ctx.fillStyle = this.settings.freeColor;
                                    this.ctx.fillRect(i*w,j*w,w,w);
                                }
                        } else if (this.predict[i][j] == 0) {
                            if (this.showChance) {  // draw chance
                                this.ctx.globalAlpha = this.settings.textOpacity;
                                this.ctx.fillStyle = this.settings.textColor;
                                this.ctx.fillText((chance[i][j]*10).toFixed(),i*w+5,j*w+w+w/4-this.settings.fontsize);
                            }
                        }
                        
                    }
                }
        }
    }
    
}
