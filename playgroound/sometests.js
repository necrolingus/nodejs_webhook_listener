const myFunc = (param, callback) => {
    setTimeout(()=>{
        console.log('After 1 second I log: ' + param)
        //now the async part
        a = 2 + 3
        b = 2 + 4
        c = 2 + 5
        //return a will never get back to the caller
        callback(a,b,c)
    },1000)
}

myFunc('Hi there!', (mysum, mysum2, mysum3) => {
    console.log(mysum)
    console.log(mysum2)
    console.log(mysum3)
})

//but lets call the callback with error, data
const myFunc2 = (param, callback) => {
    setTimeout(()=>{
        console.log('After 1 second I log: ' + param)
        //now the async part
        a = 2 + 3
        b = 2 + 4
        c = 2 + 5
        if (param == 'Good'){
            callback(undefined, "It is all good")
        }
        if (param == 'Bad'){
            callback("It is bad!", undefined)
        }
    },1000)
}

myFunc2('Good', (error, data) => {
    console.log(error)
    console.log(data)
})