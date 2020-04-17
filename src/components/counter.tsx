import React, {useState} from 'react';
import styled from 'styled-components';
import counterQuery from './counterQuery';


const Counter = () => {
    let { data } = counterQuery();
    if(!data || !data.counter){
        return(<div>Data not found</div>);
    }
    const [count,setCount] = useState(0);

    const increment = (ratio = 1) => {
        setCount(count + ratio);
    };

    const decrement = (ratio = 1) => {
        setCount(count - ratio);
    };

    return(
        <div className='App'>
            <div>Count: {count}</div>
            <div>Counter Ratio: {data.counter.ratio}</div>
            <div>
                <button onClick={() => increment(data.counter.ratio)}>Increment</button>
            </div>
            <div>
                <button onClick={() => decrement(data.counter.ratio)}>Decrement</button>
            </div>
        </div>
    );
};


export default Counter;