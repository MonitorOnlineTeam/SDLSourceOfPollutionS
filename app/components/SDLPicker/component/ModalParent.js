//import liraries
import React, { PureComponent } from 'react';
import { Modal, View, Image, TouchableOpacity, Text, Platform, Linking } from 'react-native';
// import Orientation, { getOrientation } from 'react-native-orientation';

// create a component
class ModelParent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            UpdateContent: this.props.UpdateContent || '',
            progressText: 0,
            number: 0,
            failureReason: null,
            DownLoadPath: this.props.DownLoadPath || ''
        };
    }
    showModal = () => {
        this.setState({ modalVisible: true });
    };
    hideModal = () => {
        this.setState({ modalVisible: false });
    };

    render() {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.modalVisible}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={() => {
                    // alert("Modal has been closed.");
                    this.setState({ modalVisible: false });
                }}
            >
                {this.props.children}
            </Modal>
        );
    }
}

//make this component available to the app
export default ModelParent;
