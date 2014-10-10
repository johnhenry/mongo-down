var MongoClient = require('mongodb').MongoClient
var inherits = require('inherits');
var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN;
var AbstractIterator  = require('abstract-leveldown').AbstractIterator;
var setImmediate      = global.setImmediate || process.nextTick;

module.exports = function(url, collection){
    collection = collection || "collection";
    var MongoDown = function(location) {
            if (!(this instanceof MongoDown)){
                return new MongoDown(location);
            }
            AbstractLevelDOWN.call(this, location)
            this._url = location;
            this._collection = collection;
    }
    inherits(MongoDown, AbstractLevelDOWN);
    MongoDown.prototype._open = function (options, callback) {
        var self = this;
        MongoClient.connect(url, function(err, db) {
            if(options.reconnect & !self._terminated){
                console.log("reconnect")
                db.on("close", function(){
                    self._open(options);
                });
                db.on("error", function(){
                    self._open(options);
                })
            }
            self._db = db;
            if(typeof callback === "function"){
                setImmediate(function(){
                    callback(null, self);
                })
            }
        });
    }
    MongoDown.prototype._close = function (options, callback) {
        var self = this;
        self._terminated = true;
        db.close();
    }
    MongoDown.prototype._put = function (key, value, options, callback) {
        var collection = this._collection;
        this._db.collection(collection).update(
            { key : key },
            { key : key , value : value},
            { upsert : true },
            function(error, result) {
                if(typeof callback === "function"){
                    setImmediate(function(){
                        callback(error, result, result.value)
                    })
                }
            }
        );
    }
    MongoDown.prototype._get = function (key, options, callback) {
        var collection = this._collection;
        var self = this;
        self._db.collection(collection)
        .findOne(
            { key : key},
            { value : true},
            function(error, result){
                if(typeof callback === "function"){
                    setImmediate(function(){
                        callback(error, result.value)
                    })
                }
            }
        )
    }
    MongoDown.prototype._del = function (key, options, callback) {
        var collection = this._collection;
        this._db.collection(collection).remove( { key : key } , false,
            function(error, result){
                if(typeof callback === "function"){
                    setImmediate(function(){
                        callback(error, result)
                    });
                }
            })
    }
    return MongoDown;
}
