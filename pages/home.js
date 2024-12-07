class itemText extends moveClip{
  origin = CENTER_CENTER
  text = ""
  outLine = false
  hasBg = false
  alignText = 'center'
  iconSize = 0
  fontSize = 18
  corner = [20]
  opacity = 20
  bg = color(200)
  fg = color(0)
  toggel = {
      defualt: [200, 100, 50],
      other: [50, 100, 200],
  }
  textColor = [200]
  ncount = 0

  constructor(text, x, y, w, h){
    super(x, y, w, h)
    this.text = text

    let timer = new Text()
    timer.set({
      shape: 2,
      fontSize: 24,
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
    this.timer = timer
    this.pack(timer)

    ///////////////////////////////
    let one = new Text('+', 0,  0, 30, 30)
    one.set({
      shape: 2,
        bg: 'hsl(180, 30%, 40%)',
        fg: color(200),
        fontSize: 16,
    })
    one.mousepressed = function(x, y, b){
      let p = this.Parent().Parent()
      if (b == 1) {
          this.opacity = 50
          p.fontSize = p.fontSize + 1
      }
    }
    one.mousereleased = function(x, y, b){
      this.opacity = 100
    }
    let two = new Text('-', 0,  0, 30, 30)
    two.set({
        shape: 2,
        bg: 'hsl(180, 30%, 40%)',
        fg: color(200),
        fontSize: 16,
    })
    two.mousepressed = function(x, y, b){
      let p = this.Parent().Parent()
      if (b == 1) {
          this.opacity = 50
          p.fontSize = p.fontSize - 1
      }
    }
    two.mousereleased = function(x, y, b){
      this.opacity = 100
    }
    
    let group = new listMenuView(0, 0, 80, 45)
    group.direction = 'h'
    group.hasBg = false
    group.displayItems = 2
    this.group = group
    this.group.addItem(two)
    this.group.addItem(one)
    this.pack(group)
  }
  mupdate(){
    let [ox, oy] = this.Origin()
    let [w, h] = this.Size()
    let r = 40
    let xx = (-ox) * 0.95 + r + 15
    let yy = (-oy + h)*0.95  - r*2
    let rgb = this.ncount > 0 ? this.toggel.defualt : this.toggel.other
    this.timer.set({
      x: xx,
      y: yy,
      width: r*2,
      height:r*2,
      bg: rgb,
      fg: this.textColor,
      text: this.ncount,
      fontSize: 24,
      toggel: {
          defualt: [200, 100, 50],
          other: [50, 100, 200]
      }
    })

    this.group.set({
      x: (-ox + w/2) - w*0.95/2 + this.group.width/2 + 10,
      y: (-oy + h/2)- h*0.95/2 + this.group.height/2 + 20

    })
  }
  draw(){
    this.mupdate()
    textAlign(CENTER, TOP)
    textFont(this.font)
    textSize(this.fontSize)
    rectMode(CENTER)
    imageMode(CENTER)
    let [ox, oy] = this.Origin()
    let [w, h] = this.Size()
    noStroke()
    drawingContext.save()
    let a = this.corner[0] | 0
    let b = this.corner[1] | a 
    let c = this.corner[2] | a 
    let d = this.corner[3] | a
    fill(160, 80)
    rect(-ox+w/2 , -oy+h/2 , this.width * 0.95, this.height * 0.9, a, b, c, d)
    drawingContext.clip()
    if (this.image) {
      tint(this.imageColor || 255)
      image(this.image, -ox + w/2, -oy + h/2, this.width * 0.95, this.height * 0.9)
    }
    fill('hsl(180, 50%, 40%)')
    ellipse(ox - 40, -oy + 40, 80, 80)
    fill(0)
    textSize(21)
    text(this.id, ox - 45, -oy + 40)
    fill(this.fg)
    textSize(this.fontSize)
    text(this.text, -ox+w/2 , -oy+h/2 + this.height*0.19 , this.width * 0.8, this.height * 0.9)
    drawingContext.restore()
  }
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
let bg, lv, tit, menu, adhkarbg


function loadItem(item) {
  lv.items = []
  lv.childs = []
  lv.acc = 0
  tit.text =  '/' + item.array.length + '/ ' + item.text +  String.fromCharCode(9664)
  for (const k in item.array) {
      let v = item.array[k]
      let b = new itemText()
      b.id = parseInt(k)+1
      b.text =  v.text 
      b.ncount = v.count
      b.image = bg
      // b.imageColor = color(0, 30)
      lv.addItem(b)
  }
}

let scene = new Scene()
scene.setup = function(){
  this.childs = []
  bg = newImage('res/ibg9.jpg')
  adhkarbg = newImage('res/adhkarbg.jpg')
  this.bg = 'hsl(180, 40%, 40%)'
  this.bgImage = adhkarbg
  


  tit = new Button({
      text: '',
      width: width,
      height: 60,
      x: cx,
      y: 30,
      alignText: 'center',
      fontSize: 18,
      corner:[],
      // hasBg: false,
      bg: 'hsl(180, 60%, 40%)',
      fg: [0]
  })
  this.pack(tit)
  let hh = height - 120
  lv = new listMenuView(cx, hh/2 + 120, width, hh)
  lv.direction = 'v'
  lv.hasBg = false
  lv.displayItems = 1
  lv.distanceofmove = 0
  lv.friction = 1
  lv.lineColor = 'hsl(30, 50%, 50%)'
  this.pack(lv)
  menu = new menuView(cx, 90, width, 60)
  menu.displayItems = 7
  menu.lastIndex = -1
  menu.bg = 'hsl(180, 40%, 50%)'
  // menu.hasBg = false
  menu.distanceofmove = 0
  menu.friction = 0.2
  menu.lineColor = 'hsl(30, 50%, 50%)'
  menu.space = 16
  menu.showLine = false
  menu.indexValue = 1
  menu.onChange = function() {

  }
  this.pack(menu)
  loadJSON('adhkar/adhkar.json',(e)=>{
      for (let i = 0; i < e.length; i++) {
          const v = e[i];
          let b = new Text()
          b.indexItem = i + 1
          b.alignText = 'center'
          b.iconSize = 0
          b.text = v.category 
          b.bg = 'hsl(180, 50%, 60%)'
          b.fg = [0]
          b.corner = [20]
          b.fontSize = 12
          b.array = v.array
          // b.hasBg = false
          b.update = function(){
            let p = this.Parent()
            if (p && p.indexValue == this.indexItem) {
              this.stroke = 'hsl(30, 60%, 60%)'
              this.strokeWidth = 2
              this.hasBg = true
            }else{
              this.stroke = null
              this.hasBg = false
            }
          }
          b.ontap = function(){
              let p = this.Parent()
              let item = this
              if (!p.moving) {
                p.indexValue = this.indexItem
                loadItem(item)
              }
          }
          menu.addItem(b)
      }
      loadItem(menu.items[0])
  })    
  menu.setIndex(1)
}

return scene
