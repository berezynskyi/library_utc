var config = {}

config.database = {
	contactPoints: ['127.0.0.1'], 
	keyspace: 'date'
}

config.array = [
{id: 'str', date: '2003-05-03-02', number: 3},
{id: 'str', date: '2003-05-03-04', number: 5},
{id: 'str', date: '2003-05-03-05', number: 12},
{id: 'str', date: '2003-05-03-07', number: 20},
{id: 'str', date: '2003-05-03-10', number: 4},
{id: 'str', date: '2003-05-03-13', number: 7},
{id: 'str', date: '2003-05-03-15', number: 13},
{id: 'str', date: '2003-05-03-18', number: 15},
{id: 'str', date: '2003-05-03-21', number: 18},
{id: 'str', date: '2003-05-03-22', number: 1},
{id: 'str', date: '2003-05-03-23', number: 0},

{id: 'str', date: '2003-05-04-00', number: 3},
{id: 'str', date: '2003-05-04-01', number: 2},
{id: 'str', date: '2003-05-04-02', number: 12},
{id: 'str', date: '2003-05-04-04', number: 32},
{id: 'str', date: '2003-05-04-05', number: 45},
{id: 'str', date: '2003-05-04-07', number: 4},
{id: 'str', date: '2003-05-04-08', number: 13},
{id: 'str', date: '2003-05-04-10', number: 21},
{id: 'str', date: '2003-05-04-12', number: 7},
{id: 'str', date: '2003-05-04-14', number: 6},
{id: 'str', date: '2003-05-04-18', number: 10},
{id: 'str', date: '2003-05-04-20', number: 15},
{id: 'str', date: '2003-05-04-23', number: 19},

{id: 'str', date: '2003-05-05-01', number: 22},
{id: 'str', date: '2003-05-05-13', number: 32},
{id: 'str', date: '2003-05-05-18', number: 10},
{id: 'str', date: '2003-05-05-22', number: 16},

{id: 'str', date: '2003-05-06-12', number: 1},
{id: 'str', date: '2003-05-06-15', number: 3},
{id: 'str', date: '2003-05-06-18', number: 37},
{id: 'str', date: '2003-05-06-21', number: 22}
]

config.day = {
	id: 'str',
	date: '2003-05-04',
	number: 6
}

config.dayBefore = {
	id: 'str',
	date: '2003-05-04',
	number: 7
}

config.dayAfter = {
	id: 'str',
	date: '2003-05-04',
	number: 10
}

config.sortPerDay = [ 
 { id: 'str', date: '2003-05-03', number: 98 },
 { id: 'str', date: '2003-05-04', number: 189 },
 { id: 'str', date: '2003-05-05', number: 80 },
 { id: 'str', date: '2003-05-06', number: 63 } 
 ]

module.exports = config