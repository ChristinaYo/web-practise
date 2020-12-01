var temp = 123;
if (true){
    console.log(temp);
    let temp;
}

//会报错
// if这个模块会形成作用域，如果没有let temp，考虑作用域链会向上查找，输出123，但是这里定义了temp,
