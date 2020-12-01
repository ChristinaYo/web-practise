var a = 10;
var obj = {
    a: 20,
    fn() {
        setTimeout(()=>{
            console.log(this.a);
        })
    }
}
obj.fn();
//在对象对方法里的this是指向这个对象本身，所以this.a是20