class listMenuView extends moveClip{
    bg = [50]
    direction = 'h'
    align = 'left'

    limited = true
    slide = false
    showLine = true
    lineColor = "#3581A0"
    
    displayItems = 5
    scaling = true
    space = 8
    barSize = 2
    showBar = true
    startX = 0
    startY = 0
    offset = 0
    constructor(x, y, w, h){
        super(x, y, w, h)
        this.childs = []
        this.offset = 0
        this.acc = 0
        this.items = []
        this.origin = CENTER_CENTER
        this.lastIndex = -1
        this.index = 1
        this.tindex = 1
        this.moving = false
        this.setIndex(1)
    }

    setDisplayItem(n){
        this.displayItems = n
        this.setIndex(this.index)
        
    }
    onChange(){

    }
    addItem(o){
        this.items.push(o)
        this.setIndex(this.index)
    }

    modItems(j){
        let total = this.items.length
        let n = mod((j + total), total) 
        n = n==0 ? total : n
        return n
    }

    getOffset(n){
        let total = this.displayItems
        if ( this.items.length < this.displayItems) {
            total = this.items.length
        }
        let itemSize = this.width/total
        if (this.direction == 'v') {
            itemSize = this.height/total
        }
        return (n-1) * itemSize
    }

    setIndex(n){
        this.offset = this.getOffset(n)
        this.index = n
        this.tindex = n
    }


    draw(){
        this.m_update()
    }
    
    drawafter(){
        rectMode(CENTER)
        if (!this.limited) {
            return
        }
        if (!this.showBar) {
            return
        }
        noStroke()
        fill(this.lineColor)
        
        let oX = this.origin.x * this.width
        let oY = this.origin.y * this.height 
        let sb = this.getOffset(this.displayItems)
        let maxLen = this.getOffset(this.items.length)
        
        let hasBar= maxLen - sb > 0
        if (hasBar) {
            if (this.direction == 'v') {
                let sizeBar = map(sb, 0, maxLen, 0, this.height)
                let v = map(this.offset, 0, maxLen, 0, this.height)
                let hh = this.barSize
                let bx = -oX + this.width - 2*hh
                if (this.align == 'left') {
                    bx = -oX  + hh
                }
                rect(bx, -oY + v + sizeBar/2, hh, sizeBar)
            }
            if (this.direction == 'h') {
                let sizeBar = map(sb, 0, maxLen, 0, this.width)
                let v = map(this.offset, 0, maxLen, 0, this.width)
                let hh = this.barSize
                rect(-oX + v + sizeBar/2, -oY + this.height - hh, sizeBar, hh)
            }
        }
        
    }
    
    m_update(){


        let oX = this.origin.x * this.width
        let oY = this.origin.y * this.height

        let has = this.items.length > this.displayItems - 1


        this.kIndex = floor(this.displayItems/2)
        let angle_item = (180/this.displayItems)
        let radius = this.direction == 'h'?this.width/2:this.height/2
        let total = this.displayItems

        if ( !this.fixed && this.items.length<this.displayItems) {
            total = floor(this.displayItems/2) + 1
        }

        let itemSize = (this.width/total) 

        if (this.direction == 'v') {
            itemSize = (this.height/total) 
        }
        let kindex = floor((this.offset + itemSize + itemSize - 0.5)/itemSize)
        //print(kindex, angle_item,this.offset)
        
        let maxLen = this.getOffset(this.items.length - this.displayItems + 1)
        
        if (this.items.length > this.displayItems) {
            this.offset += this.acc
        }else{
            this.offset = 0
        }
        this.acc *= this.dump
        if (this.limited) {
            this.offset = constrain(this.offset, 0, maxLen)
        }
        if(abs(this.acc) < 0.5){
            this.acc = 0
        }


        if (this.slide && !this.clicked) {
            this.offset = this.offset + (this.getOffset(this.tindex) - this.offset) * 0.2
        }
        this.moving = abs(this.acc) > 0 

        let target 
        let pox =  - oX + this.width/2
        let poy =  - oY + this.height/2
        this.childs = []
        
        let k = 0
        if (has) {
            k = -this.displayItems
        }

        let kk = this.items.length 
        if (has) {
            kk = this.displayItems
        }
        for (let i = k; i < kk; i++) {
            let j = (i + kindex)
            let nval = (j-1) * itemSize - this.offset + itemSize/2
            if ( this.direction == 'h' && this.align == 'right') {
                nval = this.width - nval
            }

            let val = -oX + nval
            if (this.direction == 'v') {
                val = -oY + nval
            }
            let idx = this.modItems(j)
            let o = this.items[idx-1]
            if (o) {
                o.origin = CENTER_CENTER
                o.x = this.direction == 'h'? val:pox
                o.y = this.direction == 'v'? val:poy
                o.width = this.direction == 'h' ? itemSize - this.space/2 : (this.width  - this.space)
                o.height = this.direction == 'v' ? itemSize - this.space/2 : (this.height - this.space)
                this.insert(o)
            }
        }

        if (this.acc == 0)  {
            if (this.lastIndex != this.index) {
                this.lastIndex = this.index
                this.onChange(this.index)
            }
        }
    }


    mousemoved(x, y, dx, dy){
        this.diffDY = this.direction == 'h'?dx:dy
        let v = sqrt(dx*dx + dy*dy)
        let is = v > this.distanceofmove
        if (this.clicked && is) {
            dx = this.align == 'right'?-dx:dx
            this.acc = this.direction == 'v'? (dy * this.friction):(dx * this.friction)
        }
    }
    mousepressed(x, y, b){
        this.diffDY = 0
        if (b == 1) {
            this.acc = 0
        }
    }
    mousereleased(x, y, b){
        let vd =  this.diffDY 
        let mouse = this.direction == 'h'? this.mx:this.my
        let len = this.direction == 'h'? this.width:this.height
        let dir = vd < 0 ? -1:1
        if (this.direction == 'v') {
            dir = vd < 0 ? -1:1
        }
        if (b == 1) {
            if (abs(vd) >= this.distanceofmove) {
                this.tindex = this.tindex + dir 
            }else if(abs(mouse) >= len/2){
                
                let dir = mouse < 0?-1:1
                this.tindex = this.tindex - dir 
            }
        }
    }
}