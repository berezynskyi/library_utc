
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'date'});
var config = require('./config.js')

function createDBStructure(callback){
  client.execute('CREATE TABLE IF NOT EXISTS test_for_cass (id varchar, date varchar, number int, PRIMARY KEY (id,date));',
    function(err,res){
      if (err) {console.log(err); return;};

      for (var i = 0; i < config.array.length; i++) {
        client.execute("INSERT INTO test_for_cass (id, date, number) VALUES ('"+config.array[i].id+"','"+config.array[i].date+"', "+config.array[i].number+");",
          function(err,res){
            if (err) {console.log(err); return;};
          })
      };
      callback('done')
    })

}

function changeTime(reqTime, timezone, toUTC){

	function changeStr(el){
		return (el/10 >= 1) ? el : '0'+el;
	}

	var UTCTimezone
    var time = reqTime.split('-');

    (toUTC) ? UTCTimezone = parseInt(time[3])-parseInt(timezone) : UTCTimezone = parseInt(time[3])+parseInt(timezone)
 
    time = new Date(time[0],time[1],time[2],UTCTimezone,0,0);
    time = new Date(time)

    time = 1900+time.getYear()+'-'+changeStr(time.getMonth())+'-'+changeStr(time.getDate())+'-'+changeStr(time.getHours());
    return time;
}

function getElement(id, reqDateFrom, reqDateTo, timezone, callback){

	if (!id || !reqDateFrom || !reqDateTo || !timezone) {callback('error')}

    //changing dateFrom according to timezone
	var dateFrom = changeTime(reqDateFrom, timezone, true)

    //changing dateTo according to timezone
    var dateTo = changeTime(reqDateTo, timezone, true)

    client.execute("SELECT id, date, number FROM test_for_cass WHERE id ='"+id+"' AND date>='"+dateFrom+"' AND date<='"+dateTo+"';", 
        function(err, result) {

          if (err) {callback('error')};
          
          for (var i = 0, len = result.rows.length; i < len; i++) {
          	result.rows[i].date = changeTime(result.rows[i].date, timezone, false)
          };

          callback(result.rows)
    });
}

function sumData(res){
	var sum = 0;
	for (var i = 0; i < res.length; i++) {
		sum += res[i].number
	};
	return sum;
}

module.exports = {
    getElement: getElement,
    sumData: sumData,
    changeTime: changeTime,
    createDBStructure: createDBStructure
};

// createDBStructure(function(res){
//   getElement('str', '2014-03-02-00', '2014-03-03-23', '+5', function(res){
//                 var sum = sumData(res)
//                 console.log(sum)
// })
// })

