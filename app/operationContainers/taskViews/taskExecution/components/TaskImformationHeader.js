import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { SCREEN_WIDTH } from '../../../../config/globalsize';

export default class TaskImformationHeader extends Component {
  render() {
    return (
      <View
        style={[{
          height: 64, width: SCREEN_WIDTH
        }]}>
        <Text style={[{ color: '#333333' }]}> textInComponent </Text>
      </View>
    );
  }
}
