//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';


import ModalParent from './component/ModalParent';
import Mask from './component/Mask';
import { SingleTime, RangeTime, HourRangeTime, RangeDay, RangeMonth, SingleTimeWheel, DataPicker } from './index';
import SingleTime_unselect from './SingleTime_unselected';
import SingleTimeWheel_Unselected from './SingleTimeWheel_Unselected';

// create a component
class PickerView extends PureComponent {

    showPicker = () => {
        this._modalParent.showModal();
    }
    static defaultProps = {
        /**
         * RangeTime:
         * RangeTime
         * MinuteRange
         * HourRange
         * DayRange
         * MonthRange
         * 
         * SingleTime
         * SingleTimeWheel
         */
        pickerType: 'SingleTime',//SingleTime RangeTime date data
        format: 'YYYY-MM-DD HH:mm',
        defaultValue: moment(),
        // selectedStartDate:moment(),
        // selectedEndDate:moment(),
        dataArray: [],
    }

    renderContent = () => {
        if (this.props.pickerType == 'RangeTime') {
            return (<RangeTime
                format={'YYYY-MM-DD HH:mm'}
                defaultDate={this.props.defaultValue}
                callbackForResult={this.props.callback}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
                selectedStartDate={this.props.selectedStartDate}
                selectedEndDate={this.props.selectedEndDate}
            />);
        } else if (this.props.pickerType == 'data') {
            return (<DataPicker
                defaultValue={this.props.defaultValue}
                callbackForResult={this.props.callback}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
                dataArray={this.props.dataArray}
                getShowValue={this.props.getShowValue}
                defaultIndexFun={this.props.defaultIndexFun}
            />);
        } else if (this.props.pickerType == 'MinuteRange') {
            return (<HourRangeTime
                callbackForResult={this.props.callback}
                defaultDate={this.props.defaultValue}
                format={'YYYY-MM-DD HH:mm'}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
                selectedStartDate={this.props.selectedStartDate}
                selectedEndDate={this.props.selectedEndDate}
            />);
        } else if (this.props.pickerType == 'HourRange') {
            return (<HourRangeTime
                callbackForResult={this.props.callback}
                defaultDate={this.props.defaultValue}
                format={'YYYY-MM-DD HH:00'}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
                selectedStartDate={this.props.selectedStartDate}
                selectedEndDate={this.props.selectedEndDate}
            />);
            // return(<RangeTime 
            //     callbackForResult={this.props.callback} 
            //     defaultDate={this.props.defaultValue}
            //     format={'YYYY-MM-DD HH:00'}
            //     hidePicker={()=>{
            //         this._modalParent.hideModal();
            //     }}
            //     selectedStartDate={this.props.selectedStartDate}
            //     selectedEndDate={this.props.selectedEndDate}
            // />);
        } else if (this.props.pickerType == 'DayRange') {
            return (<RangeDay
                callbackForResult={this.props.callback}
                defaultDate={this.props.defaultValue}
                format={'YYYY-MM-DD HH:00'}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
                selectedStartDate={this.props.selectedStartDate}
                selectedEndDate={this.props.selectedEndDate}
            />);
        } else if (this.props.pickerType == 'MonthRange') {
            return (<RangeMonth
                callbackForResult={this.props.callback}
                defaultDate={this.props.defaultValue}
                format={'YYYY-MM'}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
                selectedStartDate={this.props.selectedStartDate}
                selectedEndDate={this.props.selectedEndDate}
            />);
        } else if (this.props.pickerType == 'SingleTime') {
            return (<SingleTime
                defaultDate={this.props.defaultValue}
                format={this.props.format}
                callbackForResult={this.props.callback}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
            />);
        } else if (this.props.pickerType == 'SingleTimeWheel') {
            return (<SingleTimeWheel
                defaultDate={this.props.defaultValue}
                format={this.props.format}
                callbackForResult={this.props.callback}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
            />);
        } else if (this.props.pickerType == 'SingleTimeWheel_Unselected') {
            return (<SingleTimeWheel_Unselected
                defaultDate={this.props.defaultValue}
                format={this.props.format}
                callbackForResult={this.props.callback}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
            />);
        } else {
            return (<SingleTime
                defaultDate={this.props.defaultValue}
                format={'YYYY-MM-DD HH:mm'}
                callbackForResult={this.props.callback}
                hidePicker={() => {
                    this._modalParent.hideModal();
                }}
            />);
        }
    }

    render() {
        return (
            <ModalParent
                orientation={this.props.orientation}
                ref={ref => this._modalParent = ref}>
                <Mask
                    orientation={this.props.orientation}
                    hideDialog={() => {
                        console.log('hideDialog');
                        this._modalParent.hideModal();
                    }}>
                    {
                        this.renderContent()
                    }
                </Mask>
            </ModalParent>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default PickerView;
