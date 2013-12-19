#staticstore#

staticstore is key/value database for jsons who uses the filesysteme and static json-files.

this is in early development and will be tested soon in my other project in production mode.

##documentation##

more documentation will follow

###basic usage###

npm install staticstore

var store = require('staticstore');

/*
	initialize your db. by default in './staticstore'
	you can change this default-path by adding you own as paramater like store.initdb('/root/staticstore');
*/
store.initdb();


###store.createdb('database', callback)###
creates a database (=folder)

...

###store.deletedb('database', callback)###
deletes a database

...

###store.setItem('database/key', callback)###
saves a item in a database

...

###store.getItem('database/key', callback)###

...

###store.deleteItem('database/key', callback)###

...

###store.getAllItems('database', callback)###

...

###store.itemCount('database', callback)###

...

###store.getIndex('database', callback)###

...

###store.itemExists('database/key', callback)###

...

