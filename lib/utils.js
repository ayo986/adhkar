
function using(url){
  let o = document.createElement("script")
  o.src = url
  o.async = true
  document.head.appendChild(o)
  o.remove()
}

//requiere
function loadF(url) {
    let xhttp = new XMLHttpRequest();
    let res
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        res = this.responseText
      }
    };

    xhttp.open("GET", url, false);
    xhttp.send();
    return res
}

function fileExists(url) {
    let xhttp = new XMLHttpRequest();
    let res
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        res = true
      }
    };

    xhttp.open("GET", url, false);
    xhttp.send();
    return res
}

function loadScene(url){
  let xhttp = new XMLHttpRequest();
  let res
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let value = "function req(){" + this.responseText + "}"
      eval(value)
      res = req()
    }
  };
  xhttp.open("GET", url, false);
  xhttp.send();
  return res
}

use = loadScene
loadlib = loadScene
function gotoScene(file){
  Stage_Master.on_clear()
  Stage_Master = loadScene(file)
  Stage_Master.on_setup()
  return Stage_Master
}

function mod(i, total){
  if(total<= 0){
    return 0
  }
  while(i < 0){
    i = i + total
  }
  while(i > total){
    i = i - total
  }      
  return i == 0 ? total : i
}

function cosdeg (a) {
  return cos(radians(a))
}

function sindeg (a) {
  return sin(radians(a))
}

function vec(x, y, z){
  return new p5.Vector(x, y, z)
}
function vec2(x, y){
  return new p5.Vector(x, y)
}

function point3D(x, y, z){
  let p3d = createVector(x, y, z)

  p3d.rotateX = function(a){
    let ra = this.y * cosdeg(a) + this.z * sindeg(a)  
    let rb = this.z * cosdeg(a) - this.y * sindeg(a)  
    this.y = ra 
    this.z = rb
  }

  p3d.rotateY = function(a){
    let ra = this.x * cosdeg(a) + this.z * sindeg(a)  
    let rb = this.z * cosdeg(a) - this.x * sindeg(a)  
    this.x = ra 
    this.z = rb
  }

  p3d.rotateZ = function(a){
    let ra = this.x * cosdeg(a) + this.y * sindeg(a)  
    let rb = this.y * cosdeg(a) - this.x * sindeg(a)  
    this.x = ra 
    this.y = rb
  }
  return p3d
}


function randomPoint3d(){
  let p = p5.Vector.random3D()
  return point3D(p.x, p.y, p.z)
}

function check(array, p,  minDist){
  for (let pp of array) {
      let v = p5.Vector.sub(p, pp)
      let dist = v.mag()
      if (dist <= minDist) {
          return false
      }
  }
  return true
}

function createSpharePoint(points, total){
  let t = 0
  let minDist = 1
  while (points.length < total) {
    let p = randomPoint3d()
    if (check(points, p, minDist)) {
        points.push(p)
    }
    t++
    if (t> 100) {
        minDist = minDist/2
        t = 0
    }
  }
  return points
}

function randomItems(t){
    let n = t.length - 1
    while (n > 1) {
        let k = floor(random(0, n))
        let temp = t[n]
        t[n] = t[k]
        t[k] = temp
        n--
    }
}

function cutImage(file, col, row) {
    let images = []
    let ncol = col 
    let nrow = row   

    loadImage(file, function(img){
        img.resize(600, 200)
        let iw = img.width 
        let ih = img.height
        let pw = floor(iw/ncol)
        let ph = floor(ih/nrow)
        pixelDensity(1)
        img.loadPixels();

        for (let y = 0; y < img.height; y += ph) {
          for (let x = 0; x < img.width; x += pw) {
                let pimg = createImage(pw, ph);
                pimg.loadPixels()
                for (let yy = 0; yy < ph; yy++) {
                  for (let xx = 0; xx < pw; xx++) {
                        let c = img.get(x + xx, y + yy)
                        pimg.set(xx, yy, c);
                    }
                }
                pimg.updatePixels();
                images.push(pimg)
          }
        }

        // img.updatePixels();
    }) 

    return images
}


// fast cutting
function cuttingImage(img, x, y , pw, ph, w, h) {

    let iw = img.width
    let ih = img.height
    if (iw != w || ih != h) {
      img.resize(w, h)
      iw = img.width
      ih = img.height
    }
    let ctx = createGraphics(pw, ph)
    with(ctx){
        noStroke()
        noFill()
        tint(255)
        imageMode(CORNER)
        image(img, -x, -y, iw, ih)
    }
    return ctx
}


String.prototype.fmt = function() {
  let t = this
  for (let k of arguments) {
    t = t.replace('?',  k)
  }
  return t
}
// print("Hallo?Word?".fmt(" ", '.'))
/////

function textHeight(text, maxWidth, fs) {
    var words = text.split(' ');
    var line = '';
    var h = 0//this._textLeading;

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var testWidth = drawingContext.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
            line = words[i] + ' ';
            h += fs + 10//this._textLeading;
        } else {
            line = testLine;
        }
    }

    return h-fs*2;
}

function piecesOfimage(f, w, h, ncols, nrows) {
  let pw = (w/ncols)
  let ph = (h/nrows)
  let pieces = []
  loadImage(f, function(im){
      im.resize(w, h)
      for (let j = 0; j < nrows; j++) {
          for (let i = 0; i < ncols; i++) {
              let x = i * pw
              let y = j * ph
              let ctx = createGraphics(pw, ph)
              with(ctx){
                  tint(255)
                  imageMode(CORNER)
                  image(im, -x, -y, w, h)
              }
              pieces.push(ctx)
          }
      }
  })
  return pieces
}
Stage_Master = new moveClip(0, 0, window.innerWidth, window.innerHeight)