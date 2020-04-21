import React, {useState} from 'react';
import styled from 'styled-components';
import {GET_COUNTER} from '../queries';
import {UPDATE_COUNTER, UPDATE_RATIO} from '../mutations';
import { useQuery, useMutation } from '@apollo/react-hooks';

const Counter = () => {
    const { data, loading, error } = useQuery(GET_COUNTER);
    const [increment] =  useMutation(UPDATE_COUNTER, {variables: {ratio: data.ratio}});
    const [decrement] = useMutation(UPDATE_COUNTER, {variables: {ratio: -data.ratio}});
    const [setRatioOne] = useMutation(UPDATE_RATIO, {variables: {ratio: 1}});
    const [setRatioFive] = useMutation(UPDATE_RATIO, {variables: {ratio: 5}});
    console.log('UPDATE_COUNTER', UPDATE_COUNTER);
    console.log('data', data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    if(data) {
        return(
            <div className='App'>
                <div>Count: {data.counter}</div>
                <div>Ratio: {data.ratio}</div>
                <div>
                    <button onClick={() =>increment()}>Increment</button>
                </div>
                <div>
                    <button onClick={() => decrement()}>Decrement</button>
                </div>
                <div>
                    <button onClick={() => setRatioOne()}>Set Ratio: 1</button>
                </div>
                <div>
                    <button onClick={() => setRatioFive()}>Set Ratio: 5</button>
                </div>
            </div>
        );
    }
    
};


export default Counter;