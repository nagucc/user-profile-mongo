/**
 * Created by 文琪 on 2015/4/1.
 * 当应用系统很复杂时，我们可能会为用户保存各式各样的数据。这些数据应该是可以多个应用系统共用。
 * {
 *      credential: {
 *          eynu_qyh: { userid: 'na57' }
 *      },
 *      data: { jgh: '20090001' }
 * }
 */


var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
var uuid = require('node-uuid');


module.exports = function(dbconn, collection) {
    collection = collection || 'profiles';
    return {
        /**
         * 更新用户信息
         * @param userid
         * 用于唯一标识用户的id
         * @param doc
         * @param callback
         */
        updateUser: function (id, doc, callback) {
            MongoClient.connect(dbconn, function (err, db) {
                var users = db.collection(collection);
                users.update({'_id': id},
                    doc,
                    {upsert: true},
                    function (err, result) {
                        db.close();
                        callback(err, result);
                    });
            });
        },

        // 根据用户Id获取用户的数据
        getUser: function (userCredential, callback) {
            MongoClient.connect(dbconn, function (err, db) {
                var profiles = db.collection(collection);
                profiles.find(userCredential).toArray(function (err, docs) {
                    db.close();
                    if(err){
                        callback(err);
                    } else if(docs.length > 1){
                        callback('给定的条件不能唯一确定一个用户');
                    } else {
                        callback(null, docs[0]);
                    }
                });
            });
        },
        getOrCreateUser: function (userCredential, callback) {
            MongoClient.connect(dbconn, function (err, db) {
                var profiles = db.collection(collection);
                profiles.find(userCredential).toArray(function (err, docs) {
                    db.close();
                    if(err){
                        callback(err);
                        db.close();
                        return;
                    }
                    if(docs.length > 1){                         // 找到多个
                        callback('给定的条件不能唯一确定一个用户');
                        db.close();
                    } else if(docs.length === 0){                       // 没找到，创建新的
                        profiles.insert(userCredential, function(err, doc){
                            db.close();
                            if(err){
                                callback(err);
                                return;
                            }
                            callback(null, doc);
                        });
                    } else {                                            // 找到
                        callback(null, docs[0]);
                        db.close();
                    }
                });
            });
        }

    };
};