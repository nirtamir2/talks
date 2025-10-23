// import {useState} from "react";

export function ReactComponent(props: { name: string }) {
  // return `hello ${props.name  }`
  return <div>
    hello {props.name}
  </div>
  const { name } = props;
  // const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {/* <p>Count: {count}</p>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button> */}
    </div>
  );
}
