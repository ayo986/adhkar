class Text extends moveClip{
    origin = CENTER_CENTER
    text = "myText"
    outLine = false

    constructor(text, x, y, w, h){
      super(x, y, w, h)
      this.text = text
    }

    draw(){
      let alpha = (this.opacity/100) * 255
      textAlign('center', 'center')
      textFont(this.font)
      textSize(this.fontSize)
      let [ox, oy] = this.Origin()
      let [w, h] = this.Size()
      let c = color(this.fg)
      c.setAlpha(alpha)

      noStroke()
      noFill()
      if (this.outLine) {
        stroke(c)
      }else{
        fill(c)
      }
      // let hh = textHeight(this.text)
      text(this.text, -ox+w/2, -oy + h/2, this.width * 0.8, this.height * 0.9)
    }
}