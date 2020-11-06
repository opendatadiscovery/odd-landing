'use strict'

/* function foo() {
    this.count++
}
  
let Foo = {
    count: 0,
}
  
for(let i = 0; i < 10; i++) {
    foo.bind(Foo)()
    console.assert(Foo.count === 10)
} */
  
  

//////////////////////////////////////////////

/* let foo = {
    count: 0,
    foo() {
        this.count++;
    }
}
  
  for(let i = 0; i < 10; i++) {
    foo.foo()
    console.assert(foo.count === 10)
} */

//////////////////////////////////////////////

/* let foo = {
    foo() {
        this.count++;
    }
}

foo.count = 0;
  
  for(let i = 0; i < 10; i++) {
    foo.foo()
    console.assert(foo.count === 10)
} */
