namespace ParaSkroll {
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;


export class init {
  
  private binding_class: string = "prskrll";
  private delay_class: string = "prskrlld";
  private elmts;
  private elmts_binded: Array<paraEl> = new Array();
  private self = this;
  private viewport = {
    height: 0,
    width: 0,
    middle: 0
  };

  constructor() {
    this.set_viewport();
    this.maping();
    this.render();
  }

  private maping() {
    
    this.elmts = document.querySelectorAll('[data-' + this.binding_class + ']');
    this.elmts.forEach(elmt => {
      let dataset = elmt.dataset[this.binding_class].split("-");
      if (elmt.dataset[this.delay_class]) {
        let delay = elmt.dataset[this.delay_class];
        this.elmts_binded.push(new paraEl(elmt, dataset, delay));        
      } else {
        this.elmts_binded.push(new paraEl(elmt, dataset));
      }
    });
  }

  private set_viewport() {
    this.viewport.height = document.documentElement.clientHeight;
    this.viewport.width = document.documentElement.clientWidth;
    this.viewport.middle = this.viewport.height / 2;
  }

  private set_style () {
    let scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollbottom = this.viewport.height + scrolltop;

    this.elmts_binded.forEach((elmt, index) => {
      let difference = (((elmt.offset - elmt.delay) - scrollbottom) + this.viewport.middle);
      let ratio = (difference * 1) / this.viewport.middle;
      ratio > 1 ? ratio = 1 : ratio = ratio;
      ratio < 0 ? ratio = 0 : ratio = ratio;

      let transform: string = "";
      let opacity: string = "";

      if (elmt.css.transform.translate.x !== -100 || elmt.css.transform.translate.y !== -100) {
        let x = ratio * elmt.css.transform.translate.x;
        let y = ratio * elmt.css.transform.translate.y;
        transform += 'translate(' + x + 'px, ' + y + 'px) ';
      }

      if (elmt.css.transform.rotate.r !== -100) {
        let r = ratio * elmt.css.transform.rotate.r;
        transform += 'rotate(' + r + 'deg) ';
      }

      if (elmt.css.transform.scale.s !== -100) {
        let s = ratio * elmt.css.transform.scale.s;
        s < 1 ? s = 1 : s;
        transform += 'scale(' + s + ')';
      }
      
      if(elmt.css.opacity.o !== -100) {
        opacity = (((1 - ratio) * (1 - elmt.css.opacity.o)) + (elmt.css.opacity.o * 1)).toString();
      }
      elmt.$el.style.transform = transform;
      elmt.$el.style.opacity = opacity;
    });
  }

  render = () => {
    this.set_style();
    requestAnimationFrame(this.render);
  }

}


export interface CSSint {
  transform: {
    translate: {
      x: number;
      y: number;
    },
    rotate: {
      r: number;
    },
    scale: {
      s: number;
    }
  };
  opacity: {
    o: number
  };
}

export class paraEl {
  $el;
  height: number;
  width: number;
  offset: number;
  css = <CSSint>{
    transform: {
      translate: {
        x: 0,
        y: 0
      },
      rotate: {
        r: 0
      },
      scale: {
        s: 1
      }
    },
    opacity: {
      o: 1
    }
  };
  delay: number;
  dataset: Array<String>;

  constructor(elmt, dataset: Array<String>, delay: number = 0) {
    this.$el = elmt;
    this.dataset = dataset;
    this.delay = delay;
    this.set_data();
  }

  set_data () {
    try {
      this.get_css();
      this.height = this.$el.offsetHeight;
      this.width = this.$el.offsetWidth;
      this.offset = this.$el.offsetTop;
    } catch (e) {
      console.error(e);
    }
  }

  private get_css() {
    if (this.dataset.length % 2 !== 0) {
      throw 'Error in parameters';
    } else {
      let memory = 0;
      let keys = new Array();
      let values = new Array();

      for (let i: number = 0; i < this.dataset.length; i++) {
        if (memory % 2 === 0) {
          keys.push(this.dataset[i]);
          // Verif negative value 
          if (this.dataset[i + 1].split('!').length > 1) {
            values.push("-"+this.dataset[i + 1].split('!')[1]);
          } else {
            values.push(this.dataset[i + 1]);
          }
        }
        memory++;
      };
      this.implement_css(keys, values);
    }
  }

  private implement_css(keys, values) {
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == 'x') {  
        this.css.transform.translate.x = values[i];
      }
      else if (keys[i] == 'y') {
        this.css.transform.translate.y = values[i];
      }
      else if (keys[i] == 'r') {
        this.css.transform.rotate.r = values[i];
      }
      else if (keys[i] == 's') {
        this.css.transform.scale.s = values[i];
      }
      else if (keys[i] == 'o') {
        this.css.opacity.o = values[i];
      }
    }
  }
}
}
let para = new ParaSkroll.init();