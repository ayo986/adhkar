class itemText extends moveClip{
    origin = CENTER_CENTER
    text = ""
    outLine = false
    toggel = {
        defualt: [200, 100, 50],
        other: [50, 100, 200],
    }
    textColor = [200]
    ncount = 40
    // timeontap = 60
    constructor(text, x, y, w, h){
      super(x, y, w, h)
      this.text = text
      let [ox, oy] = this.Origin()
      let [ow, oh] = this.Size()
      let b = new Text()
      b.set({
        shape: 2,
        origin: CENTER_CENTER,
        shadowBlur: 10,
        shadowColor: 'hsl(100, 50%, 70%)',
        mousepressed:function(x, y, b){
            let p = this.Parent()
            if (b == 1) {
                this.opacity = 50
                if (p.ncount > 0) {
                    p.ncount --
                }
            }
        },

        mousereleased:function(x, y, b){
            this.opacity = 100
        }
      })
      this.pack(b)

      let one = new Text('+', 0,  0, 30, 30)
      one.set({
          bg: 'hsl(100, 50%, 30%)',
          fg: color(200)
      })
      one.mousepressed = function(x, y, b){
        let p = this.Parent()
        if (b == 1) {
            this.opacity = 50
            p.fontSize = p.fontSize + 1
        }
      }

      one.mousereleased = function(x, y, b){
        this.opacity = 100
      }
      this.pack(one)

      let two = new Text('-', 0,  0, 30, 30)
      two.set({
          bg: color(20),
          fg: color(200)
      })

      two.mousepressed = function(x, y, b){
        let p = this.Parent()
        if (b == 1) {
            this.opacity = 50
            p.fontSize = p.fontSize - 1
        }
      }

      two.mousereleased = function(x, y, b){
        this.opacity = 100
      }
      this.pack(two)
      this.timer = b
      this.fontA = one
      this.fontB = two
    }

    draw(){
      let alpha = (this.opacity/100) * 255
      textAlign(CENTER, TOP)
      textFont(this.font)
      textSize(this.fontSize)
      rectMode(CENTER)
      let [ox, oy] = this.Origin()
      let [w, h] = this.Size()
      let c = color(this.fg)
      c.setAlpha(alpha)

      noStroke()
      let rgb = this.ncount > 0 ? this.toggel.defualt : this.toggel.other
      fill(rgb)
      let r = 20
      let xx = ox - r - 5
      let yy = -oy  + r + 5
      this.timer.set({
        x: xx,
        y: yy,
        width: r*2,
        height:r*2,
        bg: rgb,
        fg: this.textColor,
        text: this.ncount,
        fontSize:14,
        toggel: {
            defualt: [200, 100, 50],
            other: [50, 100, 200]
        }
      })

      this.fontA.set({
        x: -ox + this.fontA.width*2,
        y: yy
      })

      this.fontB.set({
        x: -ox + this.fontA.width - 5,
        y: yy
      })
      noStroke()
      noFill()
      if (this.outLine) {
        stroke(c)
      }else{
        fill(c)
      }
      // let hh = textHeight(this.text)
      textSize(this.fontSize)
      text(
        this.text, -ox+w/2 , -oy+h/2 + this.height*0.1 , this.width * 0.8, this.height * 0.9)


    }
}



let scene = new Scene()
scene.setup = function(){
    this.childs = []
    this.bg = 'hsl(180, 20%, 40%)'

    let tit = new Button({
        text: '',
        width: width,
        height: 60,
        x: cx,
        y: 90,
        alignText: 'center',
        fontSize: 18,
        corner:[],
        // hasBg: false,
        bg: 'hsl(180, 60%, 20%)'
    })
    this.pack(tit)

    let hh = height - 120
    let lv = new listMenuView(cx, hh/2 + 120, width, hh)
    lv.direction = 'v'
    lv.hasBg = false
    lv.displayItems = 1
    lv.distanceofmove = 0
    lv.friction = 1
    lv.lineColor = 'hsl(30, 50%, 50%)'
    this.pack(lv)
    let menu = new menuView(cx, 30, width, 60)
    menu.displayItems = 7
    menu.lastIndex = -1
    menu.bg = 'hsl(180, 50%, 30%)'
    // menu.hasBg = false
    menu.distanceofmove = 0
    menu.friction = 0.2
    menu.lineColor = 'hsl(30, 50%, 50%)'
    menu.space = 16
    menu.showLine = false
    menu.onChange = function() {

    }
    this.pack(menu)

    function loadItem(item) {
        lv.items = []
        lv.childs = []

        let [w, h] = item.Size()
        lv.acc = 0
        tit.text =  '/' + item.array.length + '/ ' + item.text +  String.fromCharCode(9664)
        for (const k in item.array) {
            // print(k, item.array[k])

            let v = item.array[k]
            let b = new itemText()
            b.alignText = 'center'
            b.iconSize = 0
            b.text = '/' + (parseInt(k)+1) + '/\r\n' + v.text 
            b.ncount = v.count
            // b.clip = false
            // b.shape = 2
            b.bg = 'hsl(180, 20%, 45%)'
            b.fg = [0]
            // b.hasBg = false
            b.fontSize = 16
            // b.corner = [20]
            lv.addItem(b)
        }
    }
    loadJSON('adhkar/adhkar.json',(e)=>{
        for (let i = 0; i < e.length; i++) {
            const v = e[i];
            let b = new Text()
            b.alignText = 'center'
            b.iconSize = 0
            b.text = v.category 
            // b.clip = false
            // b.shape = 2
            b.bg = 'hsl(180, 60%, 20%)'
            b.fg = [200]
            b.corner = [20]
            b.fontSize = 12
            b.array = v.array
            b.ontap = function(){
                let p = this.Parent()
                let item = this
                if (!p.moving) {
                    loadItem(item)
                }
            }
            b.mousepressed = function(x, y, b){
                
                if (b == 1) {
                    this.opacity = 50
                }
            }

            b.mousereleased = function() {
                this.opacity = 100
            }
            menu.addItem(b)
        }
        loadItem(menu.items[0])
    })    
    menu.setIndex(1)

    
}

return scene
