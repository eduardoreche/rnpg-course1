import React, { Component } from 'react';

import DefaultInput from '../UI/DefaultInput/DefaultInput';

const placeInput = props => (
  <DefaultInput
    placeholder="Place name"
    value={props.placeName}
    onChangeText={props.onChangeText}
  />
);

export default placeInput;
