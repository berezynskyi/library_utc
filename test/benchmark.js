var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var lib = require('./../index.js')

function runBenchmark(callback){
	suite.add('getElement#perDay', function() {
    	lib.getElement('delta', '2003-05-03-00', '2003-05-03-23', '0', 'test_config', function(res){
    	})
	})
	.add('getElement#perMonth', function() {
	  	lib.getElement('delta', '2003-05-03-00', '2003-05-06-23', '0', 'test_config', function(res){
	  	})
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