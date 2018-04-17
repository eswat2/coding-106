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
  let answer = 0
  let done = false
  let count = 0
  const start = getMsTime()

  // NOTE:  this timeout solves the problem of waiting too long....
  setTimeout(function() {
    if (count == 2 && !done) {
      done = true
      vm.submitResult(t, answer)
    }
  }, 50)

  for (let i = 0; i < 3; i++) {
    vm.requestNumbers(i, t, function(data) {
      let delta = getMsTime() - start
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
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function reducer(acc, curr) {
    return acc + curr
  }
  let answer = 0
  let count = 0
  const stop = getRandomInt(3)

  for (let i = 0; i < 3; i++) {
    vm.requestNumbers(i, t, function(data) {
      let sum = data.reduce(reducer, 0)
      count += 1
      answer += sum
      if (count > stop) {
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

const TEST_DATA = [{
    name: "All requests within 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 5 },
      { data: [4, 5, 6], timeout: 10 },
      { data: [7, 8, 9], timeout: 15 }
    ],
    correct: 45
  },
  {
    name: "Two requests within 50ms",
    rqs: [
      { data: [1, 2, 3, 4], timeout: 5 },
      { data: [5, 6, 7], timeout: 6 },
      { data: [8, 9], timeout: 60 }
    ],
    correct: 28
  },
  {
    name: "Two requests within 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 5 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 12], timeout: 50 }
    ],
    correct: 33
  },
  {
    name: "Two requests within 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 4 },
      { data: [7, 8, 9], timeout: 50 }
    ],
    correct: 39
  },
  {
    name: "One request within 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 70 },
      { data: [7, 8, 9], timeout: 1 }
    ],
    correct: 30
  },
  {
    name: "One request within 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 1 },
      { data: [7, 8, 9], timeout: 70 }
    ],
    correct: 21
  },
  {
    name: "One request within 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 1 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 9], timeout: 70 }
    ],
    correct: 21
  },
  {
    name: "All requests over 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 55 },
      { data: [4, 5, 6], timeout: 60 },
      { data: [7, 8, 9], timeout: 65 }
    ],
    correct: 21
  },
  {
    name: "All requests over 50ms",
    rqs: [
      { data: [1, 2, 3], timeout: 60 },
      { data: [4, 5, 6], timeout: 65 },
      { data: [7, 8, 11], timeout: 55 }
    ],
    correct: 32
  },
  {
    name: "All requests over 50ms",
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
    getMsTime: function() {
      return new Date().getTime()
    },
    reset: function(load) {
      this.results = []
      if (load) {
        for (let i = 0; i < TEST_DATA.length; i++) {
          // NOTE:  determine the number to verify the time spent...
          const under = Math.max(50, TEST_DATA[i].rqs.reduce(function(max, item) {
            return (item.timeout > max) ? item.timeout : max
          }, 0))
          this.results.push({ passed: null, title: i + '.', notes: '', calls: 0, under })
        }
      }
    },
    runTests: function() {
      const vm = this
      this.reset(true)
      delay(1000).then(function() {
        TEST_DATA.forEach(function(test, indx) {
          // NOTE:  space out the tests so they don't overlap...
          delay(200 * indx).then(function() {
            const result = vm.results[indx]
            result.start = vm.getMsTime()
            console.log('-- ', indx, result.start)
            vm.runner(vm, indx)
          })
        })
      })
    },
    doNetworkRequest: function(i, t) {
      const vm = this
      const rq = TEST_DATA[t].rqs[i]
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
      const test = TEST_DATA[i]
      // console.log(i, data)
      const result = this.results[i]
      const stop = this.getMsTime()
      const delta = stop - result.start
      const delay = delta - result.under
      result.passed = data == test.correct
      result.title = i + '. ' + test.name
      result.calls += 1
      result.stop = stop
      result.delta = delta
      result.notes = '[ ' + test.correct + ', ' + data + ', ' + result.calls + ' ]'
      result.notes += '[ ' + delay + 'ms ]'

      if (result.calls > 1) {
        result.passed = false
        result.notes += ' -- too many updates'
      }
      if (delay >= 0) {
        // NOTE:  they waited to long to submit the result...
        result.passed = false
      }
    }
  }
})
