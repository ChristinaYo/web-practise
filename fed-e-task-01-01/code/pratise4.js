const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class PromiseNew {
    constructor(executor) {
        executor(this.resolve, this.reject);
    }
    state = PENDING;
    value = undefined;
    reason = undefined;
    successCallback = [];
    failureCallback = [];
    resolve = value => {
        //如果不是处理中，阻止继续
        if (this.state !== PENDING) return;
        //更改当前状态为fulfilled
        this.state = FULFILLED;
        //保存value用户后续回调使用
        this.value = value;
        //从栈里弹出成功回调
        while (this.successCallback.length) this.successCallback.shift()();
    }
    reject = reason => {
        //如果不是处理中，阻止继续
        if (this.state !== PENDING) return;
        //更改当前状态为rejected
        this.state = REJECTED;
        //保存reason用户后续回调使用
        this.reason = reason;
        //从栈里弹出失败回调
        while (this.failureCallback.length) this.failureCallback.shift()();
    }
    then(successCallback, failureCallback) {
        //返回一个promise可以继续链式调用
        let promise2 = new Promise((resolve, reject) => {
            if (this.state === FULFILLED) {
                //执行宏任务，可以在得到promise2后拿到该值判断处理
                setTimeout(() => {
                    try {
                    //成功处理，如果没有回调则默认返回value
                        successCallback = successCallback ? successCallback : value => value;
                        // successCallback(this.value);
                        let res = successCallback(this.value);
                        resolvePromise(promise2, res, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
                // resolve(res);
            } else if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        //成功处理，如果没有回调则默认返回reason
                        failureCallback = failureCallback ? failureCallback : reason => reason;
                        failureCallback(this.reason);
                        resolvePromise(promise2, res, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else {
                //同样，如果还没有运行结果，先将回调处理保存
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let res = successCallback(this.value);
                            resolvePromise(promsie2, res, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let res = failCallback(this.reason);
                            resolvePromise(promsie2, res, resolve, reject)
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
                // this.successCallback.push(successCallback);
                // this.failureCallback.push(failureCallback);
            }
        })
        return promise2;
    }

    catch (failCallback) {
        return this.then(undefined, failCallback);
    }

    static resolve (value) {
        if (value instanceof PromiseNew) {
            return value;
        }
        return new PromiseNew(resolve => resolve(value));
    }

    static all (arry) {
        for(let i=0; i<arry.length; i++) {
            if (arry[i] instanceof PromiseNew) {
                arry[i].then(value => pushResolve(i, value), reason => reject(reason))
            }else{
                pushResolve(i, arry[i])
            }
        }
        let result = [],index = 0;
        function pushResolve(i,value){
            result[i] = value;
            index ++;
            if(index === arry.length){
                resolve(result);
            }
        }
    }
}

function resolvePromise(promsie2, x, resolve, reject) {
    if (promsie2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof PromiseNew) {
        // 是promise对象用执行后的返回结果决定调用哪个
        x.then(value => resolve(value), reason => reject(reason));
    } else {
        // 普通值
        resolve(x);
    }
}
module.exports = PromiseNew;