#Mongo-Down

A replacement for [LevelDOWN](https://github.com/rvagg/node-leveldown) that works using a MongoDB Database. Can be used as a back-end for [LevelUP](https://github.com/rvagg/node-levelup) rather than an actual LevelDB store.


##See Also
- [MongoDOWN](https://github.com/watson/mongodown)

##Sample Usage

```js
var mongoURL = "<mongo db url>";
var collectionName = "<name of collection>||'collection'";
var levelup = require('levelup');
var db = levelup("what/ev/er",
    {
        db: require('mongodown')(mongoURL, collectionName)
    }
)
db.put('foo', 'bar', function (err) {
  if (err) throw err
  db.get('foo', function (err, value) {
    if (err) throw err
    console.log('Got foo =', value)
  })
})
```
