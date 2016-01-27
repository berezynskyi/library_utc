var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var lib = require('./../index.js')

function runBenchmark(callback){
	suite.add('getElement#perDay', function() {
    	lib.getElement('delta', '2016-00-23-00', '2016-00-23-23', '0', function(res){})
	})
	.add('getElement#perMonth', function() {
	  	lib.getElement('delta', '2016-00-01-00', '2016-00-31-23', '0', function(res){})
	})
	.on('cycle', function(event) {
	  console.log(String(event.target));
	})
	.on('complete', function() {
	  console.log('Fastest is ' + this.filter('fastest').map('name'));
	  callback()
	})
	// run async 
	.run({ 'async': false });
}

module.exports = {
	runBenchmark : runBenchmark
}