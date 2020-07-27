"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateInfo = void 0;

class StateInfo {
  constructor(props) {
    var {
      id,
      shortId,
      parentId,
      name,
      shortName,
      governmentAgency
    } = props;
    this.id = id !== null && id !== void 0 ? id : -1;
    this.shortId = shortId !== null && shortId !== void 0 ? shortId : -1;
    this.parentId = parentId !== null && parentId !== void 0 ? parentId : -1;
    this.name = name !== null && name !== void 0 ? name : '';
    this.shortName = shortName !== null && shortName !== void 0 ? shortName : '';
    this.governmentAgency = governmentAgency !== null && governmentAgency !== void 0 ? governmentAgency : '';
  }

  static init() {
    return new StateInfo({});
  }

  static fromJS(stateEntity) {
    if (typeof stateEntity === 'string') {
      return new StateInfo(JSON.parse(stateEntity));
    } else {
      var obj = Object.create(StateInfo.prototype);
      return new StateInfo(Object.assign(obj, stateEntity));
    }
  }

}

exports.StateInfo = StateInfo;