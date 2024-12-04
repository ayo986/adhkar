class menuView extends moveClip{
    bg = [50]
    direction = 'h'
    align = 'right'
    limited = false

    showLine = true
    lineColor = [50, 100, 255, 150]

    dump = 0.86
    displayItems = 5
    scaling = true
    valueofopacity = 20
    enableOpacityRoll = false
    space = 8
    correctSpace = 0
    distanceofmove = 4
    

    constructor(x, y, w, h){
        super(x, y, w, h)
        this.childs = []
        this.offset = 0
        this.acc = 0
        this.items = []
        this.origin = CENTER_CENTER
        this.lastIndex = -1
        this.index = 1
        this.moving = false
        this.setDisplayItem(5)
        this.setIndex(1)
    }

    setDisplayItem(n){
        this.displayItems = n
        let a = (180/this.displayItems)
        this.offset = (this.displayItems/2 -1) * a
        
    }
    onChange(){

    }
    addItem(o){
        this.items.push(o)
    }

    modItems(j){
        let total = this.items.length
        let n = mod((j + total), total) 
        n = n==0 ? total : n
        return n
    }

    getOffset(n){
        return (- n + this.displayItems/2 ) * (180 / this.displayItems)
    }

    setIndex(n){
        this.offset = this.getOffset(n)
        this.index = n
    }


    draw(){
        this.m_update()
    }
    
    drawafter(){
        let ox =  this.origin.x * this.width 
        let oy =  this.origin.y * this.height 
        if (this.showLine) {
            noFill()
            strokeWeight(4)
            stroke(this.lineColor)
            if (this.direction == 'h') {
                let lx = -ox + this.width/2
                let ly =  -oy 
                let lx2 = lx
                let ly2 = -oy + this.height/2
                line(lx, ly, lx2, ly2)    
            }
            if (this.direction == 'v') {
                let lx = this.align == 'left'? -ox : ox
                let ly =  -oy + this.height/2
                let lx2 = -ox + this.width/2
                let ly2 = ly
                line(lx, ly, lx2, ly2)    
            }
        }
 
    }
    m_update(){

        let has = this.items.length > this.displayItems - 1

        if (!has) {
            return
        }

        let wmax = max(this.width, this.height)
        let hmin = min(this.width, this.height)
        if (this.direction == 'h') {
            this.width = wmax
            this.height = hmin
        }

        if (this.direction == 'v') {
            this.width = hmin
            this.height = wmax
        }
        let oX = this.origin.x * this.width
        let oY = this.origin.y * this.height

        this.kIndex = floor(this.displayItems/2)
        let angle_item = (180/this.displayItems)
        let radius = this.direction == 'h'?this.width/2:this.height/2
        // the number for correct space = 0.27
        let itemSize = (PI/(this.displayItems - 0.27)) * (radius)
        let kindex = floor((-this.offset + angle_item)/angle_item)
        //print(kindex, angle_item,this.offset)
        this.offset += this.acc
        this.acc *= this.dump

        let rang = [90 - angle_item,  this.getOffset((this.items.length))]
        if (this.limited) {
            this.offset = constrain(this.offset, rang[1], rang[0])
        }
        
        if(abs(this.acc) < 0.5){
            this.acc = 0
        }

        this.moving = abs(this.acc) > 0 

        let target 
        let pox =  - oX + this.width/2
        let poy =  - oY + this.height/2
        this.childs = []

        let k = 1
        let kk = this.items.length
        if (has) {
            k = kindex - 1
            kk = k + this.displayItems
        }
        for (let i = k; i < kk; i++) {
            let angle = i * angle_item  + this.offset
            let j = i 
            if (mod(angle, 360) >= 180) {
                angle = mod(angle + 180, 360)
                j += this.displayItems
            }

            let index = this.modItems(j)
            let val = pox + radius * cosdeg(angle) 
            if (this.direction == 'v') {
                val = poy + radius * cosdeg(angle) 
            }
        
            let o = this.items[index-1]
            if (o) {
                o.origin = CENTER_CENTER
                o.x = this.direction == 'h'? val:pox
                o.y = this.direction == 'v'? val:poy
                o.width = this.direction == 'h' ? itemSize - this.space + this.space*0.27: (this.width  - this.space)
                o.height = this.direction == 'v' ? itemSize - this.space + this.space*0.27: (this.height - this.space)

                o.angleWork = mod(angle, 180)
                if(angle > 90 - angle_item/2 && angle < 90 + angle_item/2){
                    target = o
                    this.index = index
                }

                
                let scl = 100 * sindeg(angle) 
                scl = constrain(scl, 0, 100)
                o.sx = scl
                o.sy = scl
            
                o.visibiled = scl > 0

                if (this.scaling) {
                    if (this.direction == 'h') {
                        o.sx = scl
                        o.sy = 100
                    }
                    if (this.direction == 'v') {
                        o.sx = 100
                        o.sy = scl
                    }
                }
                let va = 100 * sindeg(angle) - this.valueofopacity * abs(cosdeg(angle))
                if (this.enableOpacityRoll) {
                    o.opacity = va
                }
               
                this.insert(o)
            }
        }

        if (this.acc == 0)  {
            if (this.lastIndex != this.index) {
                this.lastIndex = this.index
                this.onChange(this.index)
            }
            if(target && !this.clicked){
                this.offset += (90 - target.angleWork)*0.1
                
            }
            
        }
    }


    mousemoved(x, y, dx, dy){
        let v = sqrt(dx*dx + dy*dy)
        let is = v > this.distanceofmove
        if (this.clicked && is) {
            let inc = this.friction
            this.acc = this.direction == 'v'? (dy * inc) : (dx * inc)
        }
    }
    mousepressed(x, y, b){
        if (b == 1) {
            this.acc = 0
        }
    }
}