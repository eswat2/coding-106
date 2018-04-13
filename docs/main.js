/*
  TIME LIMIT - 45 mins
  CONDITIONS - "Open book", i.e. you may use google.
 
  TODO: Complete the function getSum.
     
  getSum should make 3 parallel calls to requestNumbers and produce an answer 
  as follows:
  
     - If all three requests complete within 50ms, the answer should be
       the total sum of all numbers in all 3 result arrays returned by 
       the calls to requestNumbers.
     
     - If any of the requests takes longer than 50ms to complete, 
       the answer should be the sum of all the numbers fetched by the 
       first 2 requests to complete.
     
     - Once you have calculated an answer, call the function submitResult 
       passing in your answer.
*/

function getSum(vm, t) {
  function getMsTime() {
    return new Date().getTime()
  }

  function reducer(acc, curr) {
    return acc + curr
  }
  // Calculate an answer as specified above.
  var answer = 0
  var done = false
  var count = 0
  var start = getMsTime()

  for (let i = 0; i < 3; i++) {
    vm.requestNumbers(i, t, function(data) {
      var delta = getMsTime() - start
      if (!done) {
        count += 1
        let sum = data.reduce(reducer, 0)
        if (count == 3) {
          if (delta <= 50) {
            answer += sum
          }
        } else {
          answer += sum
        }

        if ((count == 2 && delta >= 50) || count > 2) {
          done = true;
          vm.submitResult(t, answer)
        }
      }
    })
  }
}

function getSumWrong(vm, t) {
  // NOTE this is a simple but wrong example to demonstrate the UI
  function reducer(acc, curr) {
    return acc + curr
  }
  var answer = 0
  var count = 0

  for (let i = 0; i < 3; i++) {
    vm.requestNumbers(i, t, function(data) {
      let sum = data.reduce(reducer, 0)
      count += 1
      answer += sum
      if (count > 2) {
        vm.submitResult(t, answer)
      }
    })
  }
}

// DO NOT MODIFY ANYTHING BELOW THIS COMMENT 
// --------------------------------------------------------------------------

/*
 API:  requestNumbers fetches a random length array of random numbers, 
         asynchronously.
       It returns a promise that resolves with the fetched array. 
       It also optionally accepts a callback that will run when the 
         fetch completes. 
       You can assume the fetch always completes successfully.
*/

var TESTS = [{
    name: "All requests within 50ms",
    count: 3,
    rqs: [
      { data: [1, 2, 3], timeout: 5 },
      { data: [4, 5, 6], timeout: 10 },
      { data: [7, 8, 9], timeout: 15 }
    ],
    correct: 45
  },
  {
    name: "Two requests within 50ms",
    count: 3,
    rqs: [
      { data: [1, 2, 3, 4], timeout: 5 },
      { data: [5, 6, 7], timeout: 6 },
      { data: [8, 9], timeout: 60 }
    ],
    correct: 28
  },
  {
    name: "Two requests within 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 5 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 12], timeout: 50 }
    ],
    correct: 33
  },
  {
    name: "Two requests within 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 4 },
      { data: [7, 8, 9], timeout: 50 }
    ],
    correct: 39
  },
  {
    name: "One request within 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 70 },
      { data: [7, 8, 9], timeout: 1 }
    ],
    correct: 30
  },
  {
    name: "One request within 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 1 },
      { data: [7, 8, 9], timeout: 70 }
    ],
    correct: 21
  },
  {
    name: "One request within 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 1 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 9], timeout: 70 }
    ],
    correct: 21
  },
  {
    name: "All requests over 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 55 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 9], timeout: 65 }
    ],
    correct: 21
  },
  {
    name: "All requests over 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 65 },
      { data: [7, 8, 11], timeout: 55 }
    ],
    correct: 32
  },
  {
    name: "All requests over 50ms",
    count: 2,
    rqs: [
      { data: [1, 2, 3], timeout: 65 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 9], timeout: 55 }
    ],
    correct: 39
  }
]

function delay(interval) {
  return new Promise(function(resolve) {
    setTimeout(resolve, interval);
  });
}

const app = new Vue({
  el: "#app",
  data: {
    correct: true,
    results: [],
  },
  computed: {
    runner: function() {
      return this.correct ? getSum : getSumWrong
    }
  },
  methods: {
    classFor: function(item) {
      if (item.passed == null) { return ['alert-primary'] }
      return item.passed ? ['alert-success'] : ['alert-danger']
    },
    iconFor: function(item) {
      if (item.passed == null) { return ['fa', 'fa-minus', 'ikon'] }
      return item.passed ? ['fa', 'fa-check', 'ikon'] : ['fa', 'fa-times', 'ikon']
    },
    reset: function(load) {
      this.results = []
      if (load) {
        for (let i = 0; i < TESTS.length; i++) {
          this.results.push({ passed: null, title: i + '.', notes: '' })
        }
      }
    },
    runTests: function() {
      const vm = this
      this.reset(true)
      delay(1000).then(function() {
        for (let i = 0; i < TESTS.length; i++) {
          vm.runner(vm, i)
        }
      })
    },
    doNetworkRequest: function(i, t) {
      const vm = this
      const rq = TESTS[t].rqs[i]
      return delay(rq.timeout).then(function() {
        return rq.data
      })
    },
    requestNumbers: function(i, t, optCallback) {
      return this.doNetworkRequest(i, t).then(function(data) {
        if (optCallback) { optCallback(data) }
        return Promise.resolve(data);
      })
    },
    submitResult: function(i, data) {
      const test = TESTS[i]
      console.log(i, data)
      this.results[i].passed = data == test.correct
      this.results[i].title = i + '. ' + test.name
      this.results[i].notes = '[ ' + data + ', ' + test.correct + ' ]'
    }
  }
})
