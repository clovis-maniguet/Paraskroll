var ParaSkroll;
(function (ParaSkroll) {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    var init = (function () {
        function init() {
            var _this = this;
            this.binding_class = "prskrll";
            this.delay_class = "prskrlld";
            this.elmts_binded = new Array();
            this.self = this;
            this.viewport = {
                height: 0,
                width: 0,
                middle: 0
            };
            this.render = function () {
                _this.set_style();
                requestAnimationFrame(_this.render);
            };
            this.set_viewport();
            this.maping();
            this.render();
        }
        init.prototype.maping = function () {
            var _this = this;
            this.elmts = document.querySelectorAll('[data-' + this.binding_class + ']');
            this.elmts.forEach(function (elmt) {
                var dataset = elmt.dataset[_this.binding_class].split("-");
                if (elmt.dataset[_this.delay_class]) {
                    var delay = elmt.dataset[_this.delay_class];
                    _this.elmts_binded.push(new paraEl(elmt, dataset, delay));
                }
                else {
                    _this.elmts_binded.push(new paraEl(elmt, dataset));
                }
            });
        };
        init.prototype.set_viewport = function () {
            this.viewport.height = document.documentElement.clientHeight;
            this.viewport.width = document.documentElement.clientWidth;
            this.viewport.middle = this.viewport.height / 2;
        };
        init.prototype.set_style = function () {
            var _this = this;
            var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollbottom = this.viewport.height + scrolltop;
            this.elmts_binded.forEach(function (elmt, index) {
                var difference = (((elmt.offset - elmt.delay) - scrollbottom) + _this.viewport.middle);
                var ratio = (difference * 1) / _this.viewport.middle;
                ratio > 1 ? ratio = 1 : ratio = ratio;
                ratio < 0 ? ratio = 0 : ratio = ratio;
                var transform = "";
                var opacity = "";
                if (elmt.css.transform.translate.x !== -100 || elmt.css.transform.translate.y !== -100) {
                    var x = ratio * elmt.css.transform.translate.x;
                    var y = ratio * elmt.css.transform.translate.y;
                    transform += 'translate(' + x + 'px, ' + y + 'px) ';
                }
                if (elmt.css.transform.rotate.r !== -100) {
                    var r = ratio * elmt.css.transform.rotate.r;
                    transform += 'rotate(' + r + 'deg) ';
                }
                if (elmt.css.transform.scale.s !== -100) {
                    var s = ratio * elmt.css.transform.scale.s;
                    s < 1 ? s = 1 : s;
                    transform += 'scale(' + s + ')';
                }
                if (elmt.css.opacity.o !== -100) {
                    opacity = (((1 - ratio) * (1 - elmt.css.opacity.o)) + (elmt.css.opacity.o * 1)).toString();
                }
                elmt.$el.style.transform = transform;
                elmt.$el.style.opacity = opacity;
            });
        };
        return init;
    }());
    ParaSkroll.init = init;
    var paraEl = (function () {
        function paraEl(elmt, dataset, delay) {
            if (delay === void 0) { delay = 0; }
            this.css = {
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
            this.$el = elmt;
            this.dataset = dataset;
            this.delay = delay;
            this.set_data();
        }
        paraEl.prototype.set_data = function () {
            try {
                this.get_css();
                this.height = this.$el.offsetHeight;
                this.width = this.$el.offsetWidth;
                this.offset = this.$el.offsetTop;
            }
            catch (e) {
                console.error(e);
            }
        };
        paraEl.prototype.get_css = function () {
            if (this.dataset.length % 2 !== 0) {
                throw 'Error in parameters';
            }
            else {
                var memory = 0;
                var keys = new Array();
                var values = new Array();
                for (var i = 0; i < this.dataset.length; i++) {
                    if (memory % 2 === 0) {
                        keys.push(this.dataset[i]);
                        // Verif negative value 
                        if (this.dataset[i + 1].split('!').length > 1) {
                            values.push("-" + this.dataset[i + 1].split('!')[1]);
                        }
                        else {
                            values.push(this.dataset[i + 1]);
                        }
                    }
                    memory++;
                }
                ;
                this.implement_css(keys, values);
            }
        };
        paraEl.prototype.implement_css = function (keys, values) {
            for (var i = 0; i < keys.length; i++) {
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
        };
        return paraEl;
    }());
    ParaSkroll.paraEl = paraEl;
})(ParaSkroll || (ParaSkroll = {}));
var para = new ParaSkroll.init();
