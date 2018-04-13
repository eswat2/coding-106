//
// NOTE:  here's an example of a test runner which exercies code which
//        the user is asked to write to complete the exercise...
//
//

const app = new Vue({
  el: "#app",
  data: {
    results: []
  },
  methods: {
    classFor: function(item) {
      return item.passed ? ['alert-success'] : ['alert-danger']
    },
    addOne: function() {
      this.results.push({ passed: true, title: 'One', description: 'something about the test' })
    },
    addTwo: function() {
      this.results.push({ passed: false, title: 'Two', description: 'another test' })
    },
    runTests: function() {
      const vm = this
      vm.results = []
      setTimeout(function() { vm.addOne() }, 1000)
      setTimeout(function() { vm.addTwo() }, 2000)
    }
  }
})
