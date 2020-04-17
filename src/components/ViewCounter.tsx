import React, {useState} from 'react';
import styled from 'styled-components';
import {observer} from 'mobx-react';
import { viewModelCounter } from '../viewModels/viewModelCounter'

type ViewProps = {viewModel : viewModelCounter};
type ViewState = {};

@observer
export class ViewCounter extends React.Component <ViewProps, ViewState> {

    render() {
        const viewModel = this.props.viewModel;
        return(
            <div className='App'>
                <div>Count: {viewModel.number}</div>
                <div>Increase/Decrease Ratio: {viewModel.ratio}</div>
                <div>
                    <button onClick={() => {
                        viewModel.increment();
                        console.log('viewModel', viewModel);
                        }
                        }>Increment</button>
                </div>
                <div>
                    <button onClick={() => viewModel.decrement()}>Decrement</button>
                </div>
            </div>
        );
    }

    
};


export default ViewCounter;