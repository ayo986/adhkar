
class moveClip{
    x = 0
    y = 0
    width = 100
    height = 100
    visibiled = true 
    enabled = true
    angle = 0
    sx = 100
    sy = 100
    opacity = 100
    childs = []
    bg = [255]
    fg = [0]
    origin = new p5.Vector()
    radius = 100
    _parent_ = null
    nframe = 0
    hasBg = true
    shape = 1
    clip = false
    bgImage = null
    bgColorImage = [255]
    image = null
    fill = true
    stroke = false
    corner = []
    font = 'Arial';
    fontSize = 12;
    clicked = false
    timeontap = 120
    shadowColor = '#ffffff'
    shadowBlur = 0
    shadowOffsetX = 0
    shadowOffsetY = 0
    friction = 0.4
    dump = 0.98
    acc = 0
    accX = 0
    accY = 0
    distanceofmove = 4
    _istap = false
    _isc = false 

    constructor(x, y, w, h){
      this.shape = 1
      this.x = x || 0
      this.y = y || 0
      this.width = w || 100
      this.height = h || 100
      this.baseX = this.x
      this.baseY = this.y
      this.baseWidth = this.width
      this.baseHeight = this.height
      this.nframe = 0
      this.childs = []
      this.clip = true
    }

    clone(...args){
        return new this.constructor(...args)
    }
    shadow(c, r, xoff, yoff){
        drawingContext.shadowColor    = c || color(255)
        drawingContext.shadowBlur     = r || 0
        drawingContext.shadowOffsetX  = xoff || 0
        drawingContext.shadowOffsetY  = yoff || 0
    }

    rotateZaxis(px, py, xc, yc, angle){
        let a = - angle
        let dx = (px - xc)
        let dy = (py - yc)
        let rx = xc + dx * cosdeg(a) - dy * sindeg(a)
        let ry = yc + dx * sindeg(a) + dy * cosdeg(a)
        return [rx, ry]
    }

    getMousePosition(mx, my){
        let tparents = []
        let parent = this.Parent()
        while (parent) {
            tparents.unshift(parent)
            parent = parent.Parent()
        }
        for (let p of tparents) {
            let [px, py, pw, ph, pox, poy, pa] = p.getBox()
            // print(px, py, pw, ph)
            let [xm, ym] = p.rotateZaxis(mx, my, px + pox, py + poy, pa)
            mx = xm 
            my = ym
        }
        let [x, y, w, h, ox, oy, a] = this.getBox()
        let [xm, ym] = this.rotateZaxis(mx, my, x + ox, y + oy, this.angle)
        return [xm, ym, x, y, w, h, ox, oy, a]   
    }

    Parent(){
        return this._parent_
    }

    Size(){
        let [x, y, w, h, ox, oy] = this.getRect()
        return [w, h]
    }

    Origin(){
        let [x, y, w, h, ox, oy] = this.getRect()
        return [ox, oy]
    }

    getRect(){
        let sx = abs(this.sx/100)
        let sy =  abs(this.sy/100)
        let w = this.width*sx
        let h = this.height*sy
        let ox = w*this.origin.x 
        let oy = h*this.origin.y 
        let a = this.angle
        return [this.x, this.y, w, h, ox, oy, a]
    }

    getBox (){
        let [xx, yy, ww, hh, ox, oy, a] = this.getRect()
        
        let parent = this._parent_
        while (parent) {
            xx = xx * abs(parent.sx/100) + parent.x
            yy = yy * abs(parent.sy/100) + parent.y
            ww = ww * abs(parent.sx/100)
            hh = hh * abs(parent.sy/100)
            a = a + parent.angle
            ox = ox * abs(parent.sx/100)
            oy = oy * abs(parent.sy/100) 
            parent = parent._parent_
        }
        
        return [xx-ox, yy-oy, ww, hh, ox, oy, a]   
    } 

    sort(){
        // this.childs.sort((a, b) => a.z_index - b.z_index)
        this.childs.sort(function(a, b){
            return a.z_index - b.z_index;
        })
    }

    insert(o){
        o._parent_ = this
        o.z_index = this.childs.length + 1
        this.childs.push(o)
    }

    remove(a){
        let childs = this.childs
        if (typeof(a) == 'number') {
            a = constrain(b, 0, childs.length - 1)
            a = childs[a]
        }

        let index = childs.indexOf(a)
        if (index > -1) {
            childs.splice(index, 1)
        }
        return index>-1? null:a
    }
    
    pack(...args){
        for (let e of args) {
            if (typeof(e) == 'object' && e.length>0) {
                this.pack(...e)
            }else{
                this.insert(e)
            }
        }
    }

    unpack(...args){
        for (let e of args) {
            if (typeof(e) == 'object' && e.length>0) {
                this.unpack(...e)
            }else{
                this.remove(e)
            }
        }
    }

    set(prototype){
        for (let k in prototype) {
            this[k] = prototype[k]
        }
    }

    turn(a){
        this.angle += a
    }

    move(dx, dy){
        dx = dx || 0
        dy = dy == null ? dx:dy
        this.x += dx * cosdeg(this.angle)
        this.y += dy * sindeg(this.angle)
    }

    swapDepth(a, b){
        if (typeof(b) == 'number') {
            b = constrain(b, 0, this.childs.length - 1)
            b = this.childs[b]
        }

        let n = a.z_index
        a.z_index = b.z_index
        b.z_index = n
    }
    
    tofront(a){
        this.swapDepth(a, this.childs.length - 1)
    }

    toback(a){
        this.swapDepth(a, 0)
    }


    isOver(){
        if  (!this.enabled ||  !this.visibiled) {
            return false
        }
        let [mx, my, x, y, w, h, ox, oy, a] = this.getMousePosition(mouseX, mouseY)
        let bRes = (mx >= x ) && (mx <= x + w) && (my >= y) && (my <= y + h)
        return bRes
    }

    getFocus(){
        let last 
        for (let i in this.childs) {
            let o = this.childs[i]
            if (o.isOver()) {
                last = o
            }
        }
        return last
    }

    hover(){
        if (this._parent_) {
            return this._parent_.getFocus() == this ? this.isOver() : null
        }else{
            return this.isOver()
        }
    }
    on_draw(){
        rectMode(CENTER)
        imageMode(CENTER)
        textAlign(LEFT, TOP)
        tint(255)
        noStroke()
        strokeWeight(1)
        textFont(this.font)
        textSize(this.fontSize)
        

        this.on_update()
        this.nframe++
        if (!this.visibiled) {return}

        if (this.Enter && !this.isOver()) {
            this.Enter = false 
            if(this.onLeave){
                this.onLeave()
            }
        }

        
        let [oX, oY] = this.Origin()
        this.shadow(
            this.shadowColor, this.shadowBlur,
             this.shadowOffsetX, this.shadowOffsetY
        )
        if (this.clip) {
            drawingContext.save()
        }



        push()
        translate(this.x, this.y)
        rotate(radians(this.angle))
        scale(this.sx/100, this.sy/100)
        
        let alpha = ((this.opacity/100) * 255)
        if (!this.enabled) {
            alpha = 128
        }
        //bg
        let c = color(this.bg)
        let alph_bg = this.hasBg?alpha:0
        c.setAlpha(alph_bg)
        
        fill(c)

        if (this.shape == 1) {
          let [ox, oy] = this.Origin()
          let [w, h] = this.Size()
          let [a, b, c, d] = this.corner
          a = a || 0
          b = b || a 
          c = c || a 
          d = d || a
          rect(-ox+w/2, -oy+h/2, this.width, this.height, a, b, c, d)
        }
        if (this.shape == 2) {
            let rr = this.radius || Math.max(this.width, this.height)/2
            ellipse(0, 0, this.width, this.height)
        }

        if (this.clip) {
            drawingContext.clip()
        }

        if (this.bgImage) {
            let c = color(this.bgColorImage)
            c.setAlpha(alph_bg)
            tint(c)
            imageMode('center')
            image(this.bgImage, -oX + this.width/2, -oY + this.height/2, this.width, this.height)
        }

        fill(255)
        this.sort()
        if (this.drawbefor) {this.drawbefor()};
        if (this.draw) {this.draw()};
        

        for (let o of this.childs) {
            o.on_draw()
        }

        if (this.drawafter) {this.drawafter()};
        if (this.clip) {
            drawingContext.restore()
        }
        pop()
        this.shadow()
    }

    on_update(){
        let umx = mouseX
        let umy = mouseY
        let [_x, _y, o_w, o_h, o_x, o_y, o_angle] = this.getBox()
        let parent = this.Parent()
        if (parent) {
            umx = parent.m_x  - this.x
            umy = parent.m_y  - this.y
        }
        this.m_x = umx 
        this.m_y = umy

        let [r_mx, r_my] = this.rotateZaxis(this.m_x, this.m_y, -o_x + o_w/2, -o_y + o_h/2, o_angle)
        this.xmouse = r_mx 
        this.ymouse = r_my

        this.mx = r_mx 
        this.my = r_my

        
        if (this.update) {this.update()};
        for (let o of this.childs) {
            o.on_update()
        }
    }

    on_setup(){
        if (this.setup) {this.setup()};
        for (let o of this.childs) {
            o.on_setup()
        }
    }

    on_clear(){
        if (this.clear) {this.clear()};
        for (let o of this.childs) {
            o.on_clear()
        }
    }

    on_mousepressed(x, y, b){
        let me = this
        if (this.hover()) {
            this.e_startX = x 
            this.e_startY = y
            this.clicked = true
            if (this.mousepressed) {this.mousepressed(x, y, b)}

            if (this.ontap) {
                if (!me._istap) {
                    me._istap = true
                    setTimeout(function() {
                        me._istap = false
                        me.ontap(x, y, b)
                    }, this.timeontap)
                }
            }
            for (let o of this.childs) {
                o.on_mousepressed(x, y, b)
            }
        }
    } 

    on_mousereleased(x, y, b){
        
        if (this.clicked) {
            if (this.mousereleased) {this.mousereleased(x, y, b)};
        }
        this._isc = false
        this.clicked = false
        for (let o of this.childs) {
            o.on_mousereleased(x, y, b)
        }
    }
    
    on_mousedragged(x, y, dx, dy){
        // if (this.isOver()) {
        //     if (!this.Enter) {
        //         this.Enter = true
        //         if (this.onEnter) {
        //             this.onEnter()
        //         }
                
        //     }
        // }

        if (this.mousedragged) {this.mousedragged(x, y, dx, dy)};
        for (let o of this.childs) {
            o.on_mousedragged(x, y, dx, dy)
        }
    }

    on_mousemoved(x, y, dx, dy){
        if (this.isOver()) {
            if (!this.Enter) {
                this.Enter = true
                if (this.onEnter) {
                    this.onEnter()
                }
            }
            
            if (this.drag && this.clicked) {
                this.x = this.x + (x - this.e_startX)
                this.y = this.y + (y - this.e_startY)
                this.e_startX = x 
                this.e_startY = y
            }
    
            if (this.mousemoved) {this.mousemoved(x, y, dx, dy)};
            for (let o of this.childs) {
                o.on_mousemoved(x, y, dx, dy)
            }
        }


    }
    on_resize(w, h){
        if(this.resize){this.resize(w, h)}
        for (let o of this.childs) {
            o.on_resize(w, h)
        }
    }

    on_keypressed(code, k){
        if (this.keypressed) {this.keypressed(code, k)}
        for (let o of this.childs) {
            o.on_keypressed(code, k)
        }
    }

    on_keyreleased(code, k){
        if (this.keyreleased) {this.keyreleased(code, k)}
        for (let o of this.childs) {
            o.on_keyreleased(code, k)
        }
    }
}
