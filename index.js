
var cassandra = require('cassandra-driver');

var config = require('./test/config.js')
var client = new cassandra.Client(config.database);

function createDBStructure(nameOfTable, callback){
  client.execute("CREATE TABLE IF NOT EXISTS "+nameOfTable+" (id varchar, date varchar, number int, PRIMARY KEY (id,date));",
    function(err,res){
      if (err) {
          callback({status: 400, msg:'[createDBStructure function] CREATE DB error'})
          return;
        };
      callback('[createDBStructure function] done')
    })
}

function putFromConfigInDB(nameOfTable, callback){
    for (var i = 0; i < config.array.length; i++) {
        insertDataInTable(nameOfTable, config.array[i], function(err){
          callback(err)
          return;
        })
    }
    callback('[createDBStructure function] done')
}

function insertDataInTable(nameOfTable, el, callback){

     client.execute("INSERT INTO "+nameOfTable+" (id, date, number) VALUES ('"+el.id+"','"+el.date+"', "+el.number+");",
        function(err,res){
          if (err) {
            callback({status: 400, msg:'[insertDataInTable function] INSERT error'})
            return;
          };
        })
}

function changeTime(reqTime, timezone, toUTC){

  function changeStr(el){
    return (el/10 >= 1) ? el : '0'+el;
  }

  function createHoursForUTC(hour, zone){
    return (toUTC) ? parseInt(hour)-parseInt(zone) : parseInt(hour)+parseInt(zone)
  }

    var time = reqTime.split('-');
    var UTCTimezone = createHoursForUTC(time[3], timezone)
 
    time = new Date(time[0],time[1],time[2],UTCTimezone,0,0);
    time = new Date(time)

    time = 1900+time.getYear()+'-'+changeStr(time.getMonth())+'-'+changeStr(time.getDate())+'-'+changeStr(time.getHours());
    return time;
}

function selectFromDB(nameOfTable, id, dateFrom, dateTo, callback){
    client.execute("SELECT id, date, number FROM "+nameOfTable+" WHERE id ='"+id+"' AND date>='"+dateFrom+"' AND date<='"+dateTo+"';", 
        function(err, result) {
          if (err) {
            callback({status: 400, msg:'[selectFromDB function] SELECT error'})
            return;
          };
          callback(result.rows)
    });
}

function getElement(id, reqDateFrom, reqDateTo, timezone, nameOfTable, callback){

  if (!id || !reqDateFrom || !reqDateTo || !timezone || !nameOfTable) {
    callback({status: 400, msg:'[getElement function] not enough request params'})
    return;
  }

    //changing dateFrom according to timezone
    var dateFrom = changeTime(reqDateFrom, timezone, true)

    //changing dateTo according to timezone
    var dateTo = changeTime(reqDateTo, timezone, true)

    selectFromDB(nameOfTable, id, dateFrom, dateTo, function(res) {

       if (!res.status)  {
            for (var i = 0, len = res.length; i < len; i++) {
              res[i].date = changeTime(res[i].date, timezone, false)
            };
       } 

      callback(res)
    })
}

function sumData(res){
    var sum = 0;
    for (var i = 0; i < res.length; i++) {
      sum += res[i].number
    };
    return sum;
}

function sortPerDay(res, callback){

  var sorted = []

  if (res){
    for (var i = 0; i < res.length; i++) {
      res[i].date = res[i].date.substring(0,res[i].date.length-3)
    };

    res = sortArray(res)
    
    sorted.push(res[0])

    sorted = sumAndCut(sorted, res)

    callback(sorted)
  } else {
    callback({status: 400, msg:'[sortPerDay function] res is undefined'})
  }
}

function sortArray(res){
    res.sort(function (a, b) {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });

    return res
}

function sumAndCut(sorted, res){
    var newElPos = 0;

    for (var i = 1; i < res.length; i++) {
      if (sorted[newElPos].date != res[i].date) {
        newElPos++;
        sorted[newElPos] = res[i]
      } else {
        sorted[newElPos].number += res[i].number
      }
    };
    return sorted
}

module.exports = {
    getElement: getElement,
    sumData: sumData,
    changeTime: changeTime,
    createDBStructure: createDBStructure,
    insertDataInTable: insertDataInTable,
    selectFromDB: selectFromDB,
    putFromConfigInDB: putFromConfigInDB,
    sortPerDay: sortPerDay
};

// createDBStructure('test_config', function(res){
//   getElement('str', '2003-05-03-02', '2003-05-03-10', '0', 'test_config', function(res){

//     console.log(res)
// })
// })

