const fp = require('lodash/fp');
const { compose } = require('folktale/core/lambda')
const {Maybe, Container} = require('./functor');

//使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里值增加的函数ex1
let maybe = Maybe.of([5,6,1]);
let exl = () => {
    let res = maybe.map(fp.map(fp.add(1)));
    console.log(res._value);
}
exl();

//使用fp.first获取列表第一个元素
let xs = Container.of(['do','ray','mi','fa','so','la','ti','do']);
let ex2 = () => {
    let res2 = xs.map(fp.first);
    console.log(res2._value);
}
ex2();

//使用safeProp和fp.first找到user名字的首字母
let safeProp = fp.curry(function(x,o){
    return Maybe.of(o[x]);
})
let ex3 = (param) => {
    let res3 = userIO
    .map(safeProp(param))._value
    .map(fp.first);
    console.log(res3._value);
}
let user = {id: 2, name:'Albert'};
let userIO = Maybe.of(user);
ex3('name');

//Maybe重写ex4
// let ex4 = function(n) {
//     if(n){
//         return parseInt(n);
//     }
// }
let ex4 = (param) =>{
    return Maybe.of(param).map(parseInt)._value;
}
console.log(ex4('1234'));