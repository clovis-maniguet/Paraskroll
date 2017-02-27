var paraskroll = (function () {
    function paraskroll() {
        this.binding_class = "prskrll";
        this.maping();
    }
    paraskroll.prototype.maping = function () {
        var _this = this;
        this.elmts = document.querySelectorAll('[data-' + this.binding_class + ']');
        this.elmts.forEach(function (elmt) {
            var dataset = elmt.dataset[_this.binding_class].split("-");
            _this.clean_dataset(dataset);
        });
    };
    paraskroll.prototype.clean_dataset = function (dataset) {
        if (dataset.length % 2 !== 0) {
            throw 'Error in parameters';
        }
        else {
            var memory = 0;
            var formated_data = {};
            for (var i = 0; i < dataset.length; i++) {
                if (memory % 2 === 0) {
                    formated_data[dataset[i]] = dataset[i + 1];
                }
                memory++;
            }
            ;
            console.log(formated_data);
            return formated_data;
        }
    };
    paraskroll.prototype.render = function () {
    };
    return paraskroll;
}());
var para = new paraskroll();
