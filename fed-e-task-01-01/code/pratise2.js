const fp = require("lodash/fp");

const cars = [
    {
        name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true
    },
    {
        name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false
    },
    {
        name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false
    },
    {
        name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false
    },
    {
        name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true
    },
    {
        name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false
    }
]
//练习1
const isTaskInStock = fp.flowRight(fp.prop('in_stock'),fp.last);
console.log(isTaskInStock(cars));

//练习2
const firstCarName = fp.flowRight(fp.prop('name'),fp.first)
console.log(firstCarName(cars));

//练习3
let _average = function (xs) {
    return fp.reduce(fp.add, 0, xs)/xs.length
}
const averageDollarValue = fp.flowRight(_average,fp.map(fp.prop('dollar_value')));
console.log(averageDollarValue(cars));

//练习4
let _underscore = fp.replace(/\W+/g,'_');
const sanitizeNames = fp.flowRight(fp.map(fp.toLower),fp.map(_underscore),fp.map(fp.prop('name')));
console.log(sanitizeNames(cars));