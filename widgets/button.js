
class Button extends moveClip{
    clip = true
    text = 'Button'
    iconSize = 16
    imageIcon = null
    alignIcon = 'left'
    alignText = 'left'
    imageColor = [255]
    corner = [20]
    imageCircle = false
    bg = [20]
    fg = [255]

    modeIcon = true
    space = 30
    origin = CENTER_CENTER
    onPress = function(){}
    onClick = function(){}

    constructor(...args){
        super()
        this.set(...args)
    }

    draw(){
        textAlign('center', 'center')
        imageMode('center')
        textFont(this.font)
        textSize(this.fontSize)

        let [oX, oY] =this.Origin()
        let [w, h] = this.Size()
        let alpha = (this.opacity/100) * 255
        // //icon
        if (this.imageIcon) {
            let ix = -oX + this.width/2
            let iy = -oY + this.height/2

            if (this.alignIcon == 'left') {
                imageMode('left')
                ix = -oX + this.iconSize/2 + 2
            }
            if (this.alignIcon == 'right') {
                imageMode('right')
                ix = this.width - oX - (this.iconSize/2 + 2)
            }

            let c = color(this.imageColor)
            c.setAlpha(alpha)
            tint(c)

            if (this.imageCircle) {
                drawingContext.save()
                fill(this.bg)
                ellipse(ix, iy, this.iconSize, this.iconSize)
                drawingContext.clip()
                image(this.imageIcon, ix, iy, this.iconSize, this.iconSize)
                drawingContext.restore()

            }else{
                let ww = this.iconSize
                let hh = this.iconSize
                if (!this.modeIcon) {
                    ww = this.width - this.space
                    hh = this.height - this.space
                }
                image(this.imageIcon, ix, iy, ww, hh)
            }
        }
        //fg
        let c = color(this.fg)
        c.setAlpha(alpha)
        fill(c)
        let tx = -oX + w/2
        let ty = -oY + h/2
        if (this.alignText == 'left') {
            textAlign('left', 'center')
            tx = this.iconSize + 10
        }

        if (this.alignText == 'right') {
            textAlign('right', 'center')
            tx = -(this.iconSize + 10)
        }

        text(this.text, tx, ty, this.width)
    }

}