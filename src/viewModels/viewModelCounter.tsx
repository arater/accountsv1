import {action, observable} from 'mobx';
import {modelCounter} from '../models/modelCounter';

const newModel = new modelCounter();

export class viewModelCounter{
    @observable number = 0;
    @observable ratio = 5;

    @action
    increment()  {
        newModel.number = newModel.number + newModel.ratio;
        this.number = newModel.number;
        console.log('increment', newModel.number);
        return newModel.number;
    }

    @action
    decrement()  {
        newModel.number = newModel.number - newModel.ratio;
        this.number = newModel.number;
        console.log('decrement', newModel.number);
        return newModel.number;
    }

    @action
    setRatio(newRatio) {
        newModel.ratio = newRatio;
    }
};