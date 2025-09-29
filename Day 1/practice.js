// function varTest(){
//     var x=1;
//     if(true){
//         var x=2;
//         console.log(x);
//     }
//     console.log(x);
// }
// varTest();
    
// const person = {
//     name :"alice",
//     age :25,
//     greet:function(){
//         console.log("hello my name is " + this.name);
//     }
// };
// person.greet();

// const numbers = [1,2,3,4,5];

// numbers.forEach(n => console.log(n));

// const doubled = numbers.map(n => n * 2);
// console.log(doubled);

// const evens = numbers.filter(n => n % 2 === 0);
// console.log(evens);

// const sum = numbers.reduce((acc,n) => acc + n,0);
// console.log(sum);

// const person2 = {name:"charlie",age:28};
// const { name,age } = person2;

// const promise = new Promise((resolve,reject)=>{

//     let success = true;

//     if(success){
//         resolve("task completd");

//     }else{
//         reject("task failed")
//     }
// });

// .then if its success
// .catch if failiure
// .finally always runs

// const name ="sharjith";
// const age =25

// console.log(`my name is ${name} and i am ${age} years old.`);

// let arr = [3,4,7,23,6,23,67,9];
// arr.map((value,index)=> console.log(index ," : ", value))
// let newArr=arr.map((value,index)=>value>8)
// let newArr1=arr.filter((value,index)=>value>8)
// console.log(newArr)

// const name = "Sharjith";
// const age = 25;


// console.log("My name is " + name + " and I am " + age + " years old.");


// console.log(`My name is ${name} and I am ${age} years old.`);


// const message = `Hello,
// This is a multi-line
// string!`;

// console.log(message);

// const user = {
//   profile: {
//     name: "Sharjith"
//   }
// };

// Normal access
//console.log(user.profile.name); // ✅ Works


//console.log(user.profile.age.city); 

// With optional chaining
//console.log(user.profile.age?.city); // ✅ undefined (safe, no error)

// let username = null;
// console.log(username ?? "Guest");

// console.log(username || "Geust");

// let count = 0;
// console.log(username || 10);
// console.log(count ?? 10);

// const emptyObject ={};

// const obj={
//     favoritenumber:42,
//     greeting:true,
//     greeting:'hi hello',
//     address:{
//         street:'malappuram',
//         city:'kakkad',

//     },
//     fruits:['melon','pappaya'],
//     addNumbers: function (a,b) {
//         return a + b;
//     },
// };

// fetch api example

async function fetchData(){
    try{
        const response=await fetch("https://.......");
        const data=await response.json();
        console.log(data);
    }catch(error){
        console.log("Error:",error);
    }
}
