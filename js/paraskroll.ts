class paraskroll {
  
  private binding_class: string = "prskrll";
  private elmts;

  constructor() {
    this.maping();
  }

  private maping() {
    this.elmts = document.querySelectorAll('[data-' + this.binding_class + ']');
    this.elmts.forEach(elmt => {
      let dataset = elmt.dataset[this.binding_class].split("-");
      this.clean_dataset(dataset);
    });

  }

  private clean_dataset(dataset) {

    if (dataset.length % 2 !== 0) {
      throw 'Error in parameters';
    } else {
      let memory = 0;
      let formated_data = {};

      for (let i = 0; i < dataset.length; i++) {
        if (memory % 2 === 0) {
          formated_data[dataset[i]] = dataset[i + 1];
        }
        memory++;
      };

      console.log(formated_data);
      

      return formated_data;
    }

  }

  render() {

  }

}

interface parameters {
  binding_class: string
}

let para = new paraskroll();