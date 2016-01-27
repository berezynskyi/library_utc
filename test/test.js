var lib = require('./../index.js')
var config = require('./test_config.js')
var assert = require('assert');
var benchmark = require('./benchmark.js')


describe("Finding results in cassandra", function(){ 

	after(function(){
		benchmark.runBenchmark( function(){
			process.exit()
		})
	})

	describe('Successful scenario.', function(){

			it("Should create DB and put in fields", function(done){    
			    	lib.createDBStructure(function(res){
				    	assert.equal('done', res); 
				    	done();
				    	})	
		    });

			it("Should change time to UTC according to timezone", function(){    
			    	var time = lib.changeTime('2016-02-22-10','-3', true)
				    	assert.equal('2016-02-22-13', time); 			    	
		    });

			it("Should change time to UTC according to timezone(with change of day)", function(){    
			    	var time = lib.changeTime('2016-02-22-00','+3', true)
				    	assert.equal('2016-02-21-21', time); 			    	
		    });

			it("Should change time to timezone from UTC ", function(){    
			    	var time = lib.changeTime('2016-02-22-00','+3', false)
				    	assert.equal('2016-02-22-03', time); 			    	
		    });

			it("Should change time to timezone from UTC (with change of day)", function(){    
			    	var time = lib.changeTime('2016-02-22-00','-3', false)
				    	assert.equal('2016-02-21-21', time); 			    	
		    });

		   	it("Should find results  with timezone 0", function(done){ 
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-15', '0', function(res){
				    	assert.equal(res.length, 1); 
				    	assert.deepEqual(res[0], config.day); 
				    	done();
			    	})
		    });

		    it("Should find results with timezone + ", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-16', '+3', function(res){
				    	assert.equal(res.length, 1); 
				    	assert.deepEqual(res[0], config.dayBefore); 
				    	done();
			    	})
		    });

		    it("Should find results with timezone -", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '-1', function(res){
				    	assert.equal(res.length, 2); 
				    	assert.deepEqual(res[0], config.dayAfter); 
				    	done();
			    	})
		    });

		    it("Should sum results with timezone 0", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '0', function(res){
			    		var sum = lib.sumData(res)

						assert.equal(sum, 31)
						done();
					})
		    });

		    it("Should sum results with timezone +", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '+3', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 13)
						done();
					})
		    });

		    it("Should sum results with timezone -", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '-2', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 25)
						done();
					})
		    });

		    it("Should sum results per day with timezone 0", function(done){    
			    	lib.getElement('str', '2003-05-04-00', '2003-05-04-23', '0', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 189)
						done();
					})
		    });

		    it("Should sum results per day with timezone +", function(done){    
			    	lib.getElement('str', '2003-05-04-00', '2003-05-04-23', '+2', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 171)
						done();
					})
		    });

		    it("Should sum results per day with timezone -", function(done){    
			    	lib.getElement('str', '2003-05-04-00', '2003-05-04-23', '-2', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 208)
						done();
					})
		    });
		});

		describe('Error handling scenario.', function(){
			it("Should throw exception if find without required parameters.", function(done){

			    	lib.getElement('delta', '2016-02-22-10', '2016-02-22-11', null, function(res){
						if (res != 'error'){
							assert.fail("Should return error.");
						} else {
							assert.equal(res, "error");						
						} 

						done()
			    	})
			});
		});

});
