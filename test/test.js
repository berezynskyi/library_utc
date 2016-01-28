var lib = require('./../index.js')
var config = require('./config.js')
var assert = require('assert');
var benchmark = require('./benchmark.js')


describe("Finding results in cassandra", function(){ 

	after(function(){
		benchmark.runBenchmark( function(){
			process.exit()
		})
	})

	describe('Successful scenario.', function(){

			it("Should create DB", function(done){    
			    	lib.createDBStructure('test_config', function(res){
				    	assert.equal('[createDBStructure function] done', res); 
				    	done();
				    	})	
		    });

		    it("Should put fields in DB", function(done){    
			    	lib.putFromConfigInDB('test_config', function(res){
				    	assert.equal('[createDBStructure function] done', res); 
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
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-15', '0', 'test_config', function(res){
				    	assert.equal(res.length, 1); 
				    	assert.deepEqual(res[0], config.day); 
				    	done();
			    	})
		    });

		    it("Should find results with timezone + ", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-16', '+3', 'test_config', function(res){
				    	assert.equal(res.length, 1); 
				    	assert.deepEqual(res[0], config.dayBefore); 
				    	done();
			    	})
		    });

		    it("Should find results with timezone -", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '-1', 'test_config', function(res){
				    	assert.equal(res.length, 2); 
				    	assert.deepEqual(res[0], config.dayAfter); 
				    	done();
			    	})
		    });

		    it("Should sum results with timezone 0", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '0', 'test_config', function(res){
			    		var sum = lib.sumData(res)

						assert.equal(sum, 31)
						done();
					})
		    });

		    it("Should sum results with timezone +", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '+3', 'test_config', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 13)
						done();
					})
		    });

		    it("Should sum results with timezone -", function(done){    
			    	lib.getElement('str', '2003-05-04-14', '2003-05-04-20', '-2', 'test_config', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 25)
						done();
					})
		    });

		    it("Should sum results per day with timezone 0", function(done){    
			    	lib.getElement('str', '2003-05-04-00', '2003-05-04-23', '0', 'test_config', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 189)
						done();
					})
		    });

		    it("Should sum results per day with timezone +", function(done){    
			    	lib.getElement('str', '2003-05-04-00', '2003-05-04-23', '+2', 'test_config', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 171)
						done();
					})
		    });

		    it("Should sum results per day with timezone -", function(done){    
			    	lib.getElement('str', '2003-05-04-00', '2003-05-04-23', '-2', 'test_config', function(res){
			    		var sum = lib.sumData(res)
						assert.equal(sum, 208)
						done();
					})
		    });

		    it("Should sum results per day", function(done){    
			    	lib.sortPerDay(config.array, function(res){
						assert.deepEqual(res, config.sortPerDay)
						done();
					})
		    });
		});

		describe('Error handling scenario.', function(){
			it("Should throw exception if find without required parameters.", function(done){

			    	lib.getElement('delta', '2016-02-22-10', '2016-02-22-11', null, 'test_config', function(res){
						if (res.status != 400){
							assert.fail("Should return error.");
						} else {
							assert.equal(res.msg, "[getElement function] not enough request params");						
						} 

						done()
			    	})
			});

			it("Should throw exception if INSERT in not created table.", function(done){

			    	lib.insertDataInTable('test_asda', {id: 'delta', date: '2016-02-22-10', number:1}, function(res){
						if (res.status != 400){
							assert.fail("Should return error.");
						} else {
							assert.equal(res.msg, '[insertDataInTable function] INSERT error');						
						} 

						done()
			    	})
			});

			it("Should throw exception if SELECT on not created table.", function(done){

			    	lib.selectFromDB('test_asda', 'str', '2003-05-03-02', '2003-05-03-10', function(res){

						if (res.status != 400){
							assert.fail("Should return error.");
						} else {
							assert.equal(res.msg, "[selectFromDB function] SELECT error");						
						} 

						done()
			    	})
			});

			it("Should throw exception if req param is undefined", function(done){

			    	lib.sortPerDay(null, function(res){

						if (res.status != 400){
							assert.fail("Should return error.");
						} else {
							assert.equal(res.msg, "[sortPerDay function] res is undefined");						
						} 

						done()
			    	})
			});

		});

});
