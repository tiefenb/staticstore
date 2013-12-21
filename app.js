var fs = require('graceful-fs');
	fs = require('fs.extra');
	
var path = require('path');
var async = require('async');

(function(exports) {

	// default path
	var dbpath = '/staticstore';
	var initialized = false;

	exports.initdb = function(costumpath, callback) {
		callback = callback || function() {};
		dbpath = costumpath || ((path.dirname(process.mainModule.filename) || __dirname) + dbpath);
		fs.exists(dbpath, function (exists) {
			if(exists) {
				initialized = true;
				callback(false);
			} else {
				fs.mkdir(dbpath, function() {
					initialized = true;
					callback(false);
				});
			}
		});
	};

	exports.createdb = function(name, callback) {
		callback = callback || function() {};
		var newdb = dbpath+'/'+name;

		if(!name) {
			return callback(true, 'Please define database');
		}

		fs.exists(newdb, function (exists) {
			if(exists) {
				callback('Database already exists!');
			} else {
				fs.mkdir(newdb, function() {
					callback(false);
				});
			}
		});
	};

	exports.deletedb = function(name, callback) {
		callback = callback || function() {};
		var removedb = dbpath+'/'+name;

		if(!name) {
			return callback(true, 'Please define database');
		}

		fs.exists(removedb, function (exists) {
			if(!exists) {
				callback('Database not found!');
			} else {
				fs.rmrf(removedb, function() {
					callback(false);
				});
			}
		});
	};

	exports.getItem = function(id, callback) {
		callback = callback || function() {};
		var database = id.replace(/(.*)\/(.*)/gm, '$1');
		id = id.replace(/(.*)\/(.*)/gm, '$2');

		if(!database || !id) {
			return callback(true, 'Please define database and key e.g. (database/key)');
		}

		var itemid = dbpath + '/' + database + '/' + id + '.json';

		fs.readFile(itemid, function (err, data) {
		  if (err) {
		  	return callback('Item not found!');
		  } else {

		  	try {
		  		data = JSON.parse(data);
		  	} catch(e) {
		  		return callback('File invalid!');
		  	}

		  	callback(false, data);
		  }
		});
	};

	exports.setItem = function(id, data, callback) {
		callback = (typeof data === 'function') ? data : callback;
		data = (typeof data === 'function') ? undefined : data;
		callback = callback || function() {};

		var database = id.replace(/(.*)\/(.*)/gm, '$1');
		id = String(id.replace(/(.*)\/(.*)/gm, '$2'));

		if(!database || !id) {
			return callback(true, 'Please define database and key e.g. (database/key)');
		}

		data = data || {};
		data._id = id;
		data.timestamp = new Date();
		data = JSON.stringify(data);

		var itemid = dbpath + '/' + database + '/' + id + '.json';

		fs.writeFile(itemid, data, function (err) {
		  if (err) {
		  	return callback('Item not saved!');
		  } else {
		  	callback(false, id);
		  }
		});

	};

	exports.deleteItem = function(id, callback) {
		callback = callback || function() {};
		var database = id.replace(/(.*)\/(.*)/gm, '$1');
		id = id.replace(/(.*)\/(.*)/gm, '$2');

		if(!database || !id) {
			return callback(true, 'Please define database and key e.g. (database/key)');
		}

		var itemid = dbpath + '/' + database + '/' + id + '.json';

		fs.unlink(itemid, function (err) {
		  if (err) {
		  	return callback('Item not deleted/found!');
		  } else {
		  	callback(false, id);
		  }
		});

	};

	exports.getAllItems = function(database, callback) {
		callback = callback || function() {};
		var db = dbpath+'/'+database;

		if(!database) {
			return callback(true, 'Please define database');
		}

		fs.exists(db, function (exists) {
			if(exists) {
				fs.readdir(db, function(err, files) {
					if(err) {
						callback('Cant read all indizies');
					} else {
						var filesArray = [];
						var q = async.queue(function(file, cb) {
							fs.readFile(db+'/'+file, function(err, data) {
								if(!err) {

									try {
										data = JSON.parse(data)
									} catch(e) {
										console.log('File invalid!', data);
									}

									if(typeof data !== 'string') {
										filesArray.push(data);
									}

								}
								cb();
							});
						});

						q.drain = function() {
							callback(false, filesArray);
						};

						q.push(files);
					}
				});
			} else {
				callback('Database not found!');
			}
		});

	};

	exports.itemExists = function(id, callback) {
		callback = callback || function() {};
		var database = id.replace(/(.*)\/(.*)/gm, '$1');
		id = id.replace(/(.*)\/(.*)/gm, '$2');

		if(!database || !id) {
			return callback(true, 'Please define database and key e.g. (database/key)');
		}

		var itemid = dbpath + '/' + database + '/' + id + '.json';

		fs.exists(itemid, function (exists) {
			if(exists) {
				callback(false, true);
			} else {
				callback(false, false);
			}
		});

	};

	exports.getIndex = function(database, callback) {
		callback = callback || function() {};
		var db = dbpath+'/'+database;

		if(!database) {
			return callback(true, 'Please define database');
		}

		fs.exists(db, function (exists) {
			if(exists) {
				fs.readdir(db, function(err, files) {
					if(err) {
						callback('Cant read all indizies');
					} else {
						files.forEach(function(item, index) {
							files[index] = item.replace(/\.json/gm, '');
						});
						callback(false, files);
					}
				});
			} else {
				callback('Database not found!');
			}
		});
	};

	exports.itemCount = function(database, callback) {
		callback = callback || function() {};
		var db = dbpath+'/'+database;

		if(!database) {
			return callback(true, 'Please define database');
		}

		fs.exists(db, function (exists) {
			if(exists) {
				fs.readdir(db, function(err, files) {
					if(err || !files) {
						callback('Cant read all indizies');
					} else {
						callback(false, (files.length || 0));
					}
				});
			} else {
				callback('Database not found!');
			}
		});

	};

})(module.exports);
