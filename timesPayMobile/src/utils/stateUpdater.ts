import { deepCompare } from './deepCompare';

export const stateUpdater = (obj, attr, reducer) => {
  if(! deepCompare(obj.state[attr], obj.props[reducer][attr])) {
    obj.setState({
      [attr]: obj.props[reducer][attr]
    })
  }
}
