import React, { Component } from 'react'
import { Modal, Text, View } from 'react-native'
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import Mask from '../Mask';

export default class BottomDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            UpdateContent: this.props.UpdateContent || '',
            progressText: 0,
            number: 0,
            failureReason: null,
            DownLoadPath: this.props.DownLoadPath || '',
            canUpdate: true
        };
    }
    showModal = () => {
        this.setState({ modalVisible: true });
    };
    hideModal = () => {
        if (this.props.ForcedUpdate == true) {
            return;
        } else {
            this.setState({ modalVisible: false });
        }
    };

    render() {
        return (<Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                this.setState({ modalVisible: false });
            }}
        >
            <Mask
                style={{
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }}
                hideDialog={() => {
                    this.hideModal();
                }}
            >
                {
                    this.props.children ? (
                        this.props.children
                    ):(
                        <View style={{width:SCREEN_WIDTH-30,height:80,borderRadius:12
                        , alignItems:'center', justifyContent:'center',backgroundColor:globalcolor.lightGreyBackground}}>
                            <Text style={{fontSize:15,color:'#666'}}>{'空的Dialog'}</Text>
                        </View>
                    )
                }
            </Mask>
        </Modal>)
    }
}
