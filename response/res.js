//berfungsi untuk membuat standarisasi / skeleton 
//response

'user-strict';

exports.single = function(values,res,params){
    var data = {
        'status':200,
        'data':params
    };
    res.json(data);
    res.end();
};

exports.ok = function(values,res){
    var data = {
        'status':200,
        'values':values
    };
    res.json(data);
    res.end();
};

exports.failed = function(values,res){
    var data = {
        'status':404,
        'values':values
    };
    res.json(data);
    res.end();
}


exports.notfound = function(values,res){
    var data = {
        'status':01,
        'values':values
    };
    res.json(data);
    res.end();
}