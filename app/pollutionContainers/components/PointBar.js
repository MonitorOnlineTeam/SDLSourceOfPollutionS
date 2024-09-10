import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { OperationAlertDialog, SDLText, Touchable } from '../../components';
import { getImageByType, getStatusByCode } from '../../pollutionModels/utils';
import AlarmIcon from './AlarmIcon';
import { checkAlarmByMN } from '../../pollutionModels/utils';
import TextLabel from './TextLabel';
import { SentencedToEmpty } from '../../utils';

/**
 * 站点bar
 * @export
 * @class PointBar
 * @extends {PureComponent}
 */
@connect(({ websocket, pointDetails, taskDetailModel }) => ({
    RealTimeAlarms: websocket.RealTimeAlarms,
    sourceType: pointDetails.sourceType,
    taskDetail: taskDetailModel.taskDetail,
}))
export default class PointBar extends PureComponent {
    render() {
        let responseTime = {
            headTitle: '响应时间',
            innersHeight: 130,
            messText: `${SentencedToEmpty(this.props.taskDetail, ['CreateTime'], '')}`,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => { }
                }
            ]
        }
        // SentencedToEmpty(this.props.taskDetail, ['CreateTime'], '')
        const { sourceType, style, DGIMN, entName = '企业名称', showImg = true, pointName = '站点名称', status, pollutantType, outputFlag = 0, rest } = this.props;
        const Alarm = checkAlarmByMN(DGIMN, this.props.RealTimeAlarms);
        return (
            <Touchable style={[styles.container, style]} {...rest}>
                <View style={{ marginTop: 15, marginLeft: 13, marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <SDLText fontType={'normal'} style={{ color: '#333', flex: 1, width: 100 }} numberOfLines={1}>
                        {entName}
                    </SDLText>
                    <AlarmIcon imageStyle={{ width: 15, height: 15 }} Alarm={Alarm} />
                    {showImg ? <Image style={{ width: 15, height: 15, marginLeft: 15, tintColor: getStatusByCode(status).color }} source={getImageByType(pollutantType).image} /> : null}
                </View>
                <View style={{ marginTop: 5, marginBottom: 15, flexDirection: 'row', alignItems: 'center', marginLeft: 13 }}>
                    <Image style={{ width: 13, height: 13 }} source={require('../../images/icon_location.png')} />
                    <SDLText fontType={'small'} style={{ color: '#666', marginLeft: 2 }} numberOfLines={1}>
                        {pointName}
                    </SDLText>
                    {outputFlag == 1 || outputFlag == '1' ? <TextLabel text={'停运'} color={'#ff0000'} style={{ marginLeft: 4 }} /> : null}
                    {this.props.sourceType == 'AssociatedAlarm' ? <TouchableOpacity
                        style={[{ marginLeft: 15 }]}
                        onPress={() => {
                            SentencedToEmpty(this, ['refs', 'responseTimeAlert', 'show'], () => { })();
                        }}
                    >
                        <View style={[{
                            height: 17, backgroundColor: '#4AA0FF', justifyContent: 'center'
                            , alignItems: 'center', borderRadius: 3
                        }]}>
                            <SDLText fontType={'small'} style={{ color: 'white', marginHorizontal: 8 }} numberOfLines={1}>
                                {'响应时间'}
                            </SDLText>
                        </View>
                    </TouchableOpacity> : null
                    }
                    {this.props.sourceType == 'AssociatedAlarm' ?
                        <OperationAlertDialog options={responseTime} ref="responseTimeAlert" />
                        : null
                    }
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'column'
    }
});
