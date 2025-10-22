import { useEffect, useState,useRef } from "react";


function App() {

const[data,setData]=useState([]);  
const loadPosts=async()=>{
  const res= await fetch('https://jsonplaceholder.typicode.com/posts');
  const data= await res.json();
  setData(data);
  
};

return (
  <div>
    <button onClick={loadPosts}>Load</button>
    {data.map((post) => <h1>{post.title}</h1>)}
    

  </div>


)


// const numberRef = useRef();
// const[fact, setFact] = useState();
// const[loading, setLoading] = useState(false);

// const getFact = async () => {
//   const number=numberRef.current.value;
//   setLoading(true)
//   const response = await fetch(`http://numbersapi.com/${number}`);
//   const text = await response.text();
//   setLoading(false);
// setFact(text);
  
// };

// if(loading){
//   return <div>loading the data from server.....</div>
// }
// return (
//   <div>
//     <input  ref={numberRef} type='number' placeholder='enter number' />
//     <button onClick={getFact}>Get Fact  </button>
//   </div>
// );  


// const data = {
//   kerala:"trivandrum",
//   karnataka:"bengaluru",
//   tamilnadu:"chennai",
// };

// const[selectedState,setSelectedState]=useState('kerala');
// const[selectedStateCapital,setSelectedStateCapital]=useState('Thiruvanthapuram');

// const changeState =(e) => {
//   setSelectedState(e.target.value);
//   setSelectedStateCapital(data[e.target.value]);
// };



// useEffect (() =>{
//     setSelectedStateCapital(data[selectedState]);},[selectedState]);
//   return (
//   <div>
//     <select onChange={changeState}>
//       <option value="kerala" >kerala</option>
//       <option value="karnataka" >karnataka</option>


//     </select>
//     <p>selected state is: {selectedState}</p>
//     <p>Capital of selectd state: {selectedStateCapital}</p>
//   </div>
//   )


// const[count,setCount]=useState(0);  
//   const increment=() =>{
     
//      setCount(count+1);
//      console.log("count is",count);
// }

//   const decrement=() =>{
     
//      setCount(count-1);
//      console.log("count is",count);
// }


//   return (
//   <div>
//     <h1>{count}</h1>
//     <button onClick={increment}>+</button>
//     <button onClick={decrement}>-</button>
//   </div>
//   );
}

export default App
