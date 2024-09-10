//import liraries
import React, { PureComponent } from 'react';
import { View, ScrollView, Platform, StyleSheet } from 'react-native';

import { BaseTable1, BaseRow1, BaseOrderView } from '..';

const CONENT_FIXED = 1;
const CONENT_MOBILE = 2;
/**
 * 固定列横向滚动
 */
export default class DTable extends PureComponent {
    constructor(props) {
        super(props);
        const order = { orderFun: null, orderType: 'desc', orderKey: '' };
        const { titleProps } = props;
        let _order = order;
        if (titleProps.order) _order = { ..._order, ...titleProps.order };
        this.state = { ..._order };
        this.currentTable = '';
    }

    getTitleProps = (start, end) => {
        const { titleProps } = this.props;
        const { flexArr, widthArr, alignArr, data } = titleProps;
        const _flexArr = flexArr && flexArr.slice(start, end);
        const _widthArr = widthArr && widthArr.slice(start, end);
        const _alignArr = alignArr && alignArr.slice(start, end);
        const _data = this.getTitleData(data.slice(start, end));
        const _titleProps = { ...titleProps, flexArr: _flexArr, widthArr: _widthArr, alignArr: _alignArr, data: _data };
        return _titleProps;
    };
    getTitleData(data) {
        const titleData = [];
        data.map((item, index) => {
            if (item.order) titleData.push(this.getOrderTitle(item.title, item.key));
            else titleData.push(item.title);
        });
        return titleData;
    }

    getOrderTitle = (title, key) => {
        const {
            titleProps: { textStyle }
        } = this.props;

        let order = 'none';
        if (key == this.state.orderKey) {
            order = this.state.orderType;
        }
        return (
            <BaseOrderView
                order={order}
                text={title}
                textStyle={textStyle}
                style={{ flex: 1, width: '100%' }}
                onPress={() => {
                    if (this.state.orderKey == key) {
                        if (this.state.orderType == 'desc') {
                            this.setState({ orderType: 'asc' });
                        } else if (this.state.orderType == 'asc') {
                            this.setState({ orderType: 'desc' });
                        }
                    } else {
                        this.setState({ orderKey: key });
                    }
                }}
            />
        );
    };

    getContentProps(start, end) {
        const { titleProps, contentProps } = this.props;
        const { flexArr, widthArr, alignArr, data, onRowClick } = contentProps;
        const _flexArr = flexArr && flexArr.slice(start, end);
        const _widthArr = widthArr && widthArr.slice(start, end);
        const _alignArr = alignArr && alignArr.slice(start, end);
        const _data = this.getContentData(titleProps.data.slice(start, end), data);
        const _onRowClick =
            onRowClick &&
            (index => {
                onRowClick(index, data[index]);
            });
        const _contentProps = { ...contentProps, flexArr: _flexArr, widthArr: _widthArr, alignArr: _alignArr, data: _data, onRowClick: _onRowClick };
        return _contentProps;
    }

    getContentData(titleData, contentData) {
        const {
            contentProps: { renderCell, defaultContent }
        } = this.props;
        const _contentData = [];
        for (let j = 0; j < contentData.length; j++) {
            let rowData = [];
            for (let i = 0; i < titleData.length; i++) {
                let key = titleData[i].key;
                let cell;
                if (renderCell) {
                    cell = renderCell(i, key, contentData[j]);
                    if (cell == -1) cell = contentData[j][key];
                } else {
                    cell = contentData[j][key];
                }
                if (cell == null || cell == undefined || cell === '' || cell == 'null' || cell == 'undefined') {
                    cell = defaultContent || '';
                }
                rowData.push(cell);
            }
            _contentData.push(rowData);
        }
        return _contentData;
    }

    sortData = () => {
        if (this.state.orderKey) {
            if (this.props.titleProps.order && this.props.titleProps.order.orderFun) {
                this.props.titleProps.order.orderFun(this.props.contentProps.data, this.state.orderKey, this.state.orderType);
            } else {
                this.props.contentProps.data.sort((a, b) => {
                    a = a[this.state.orderKey];
                    b = b[this.state.orderKey];
                    if (this.state.orderType == 'asc') {
                        return a - b;
                    } else {
                        return b - a;
                    }
                });
            }
            this.props.contentProps.data.map((item, index) => {
                item.sortIndex = index + 1;
            });
        }
    };

    getFixWidth = () => {
        let fixWidth = 0;
        const {
            titleProps: { widthArr, fixCol }
        } = this.props;
        for (let i = 0; i < fixCol; i++) {
            fixWidth += widthArr[i];
        }
        return fixWidth;
    };

    /**
     * 渲染内容固定列
     * @memberof FixTable
     */
    _renderContentFix = () => {
        const {
            titleProps: { fixCol }
        } = this.props;
        return (
            <BaseTable1
                ref={ref => (this.contentFix = ref)}
                onScroll={({
                    nativeEvent: {
                        contentOffset: { x, y }
                    }
                }) => {
                    if (this.currentTable == CONENT_FIXED) this.contentMobile.scrollToOffset({ animated: false, offset: y });
                }}
                scrollEventThrottle={10}
                onTouchStart={() => {
                    this.currentTable = CONENT_FIXED;
                }}
                style={{ flex: 1 }}
                {...this.getContentProps(0, fixCol)}
            />
        );
    };
    /**
     * 渲染内容移动列
     * @memberof FixTable
     */
    _renderContentMobile = () => {
        const {
            titleProps: { fixCol, data }
        } = this.props;

        return (
            <BaseTable1
                style={{ flex: 1 }}
                ref={ref => (this.contentMobile = ref)}
                onScroll={({
                    nativeEvent: {
                        contentOffset: { x, y }
                    }
                }) => {
                    if (this.currentTable == CONENT_MOBILE) this.contentFix.scrollToOffset({ animated: false, offset: y });
                }}
                scrollEventThrottle={10}
                onTouchStart={() => {
                    this.currentTable = CONENT_MOBILE;
                }}
                {...this.getContentProps(fixCol, data.length)}
            />
        );
    };

    /**
     *渲染标题固定列
     * @memberof TitleTable
     */
    _renderTitleFix = () => {
        const { titleProps } = this.props;
        const { fixCol } = titleProps;
        return <BaseRow1 {...this.getTitleProps(0, fixCol)} />;
    };

    /**
     *渲染标题移动列
     * @memberof TitleTable
     */
    _renderTitleMobile = () => {
        const { titleProps } = this.props;
        const { fixCol, data } = titleProps;
        return <BaseRow1 {...this.getTitleProps(fixCol, data.length)} />;
    };

    /** 渲染带有固定列的table */
    _renderFixTable() {
        return (
            <View style={[styles.fixcontainer, this.props.style]}>
                <View style={[styles.leftcontainer, { width: this.getFixWidth() }]}>
                    {this._renderTitleFix()}
                    {this._renderContentFix()}
                </View>
                <ScrollView style={styles.rightcontainer} showsHorizontalScrollIndicator={false} horizontal={true}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        {this._renderTitleMobile()}
                        {this._renderContentMobile()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    /** 渲染移动列的table */
    _renderTitleTable() {
        const {
            contentHeader = null,
            titleProps: { data: titleData },
            contentProps: { data: contentData }
        } = this.props;

        const nextTitlePros = this.getTitleProps(0, titleData.length);
        const nextContentProps = this.getContentProps(0, titleData.length);

        //找出需要悬浮在顶部的
        if (contentHeader && contentHeader.compareMethord) {
            let i = -1;
            contentData.map((item, index) => {
                if (contentHeader.compareMethord(item)) {
                    i = index;
                }
            });
            if (i >= 0) contentHeader.headerProps = { ...nextContentProps, data: nextContentProps.data[i] };
        }
        return (
            <View style={styles.titlecontainer}>
                <BaseRow1 {...nextTitlePros} />
                {contentHeader && contentHeader.headerProps ? <BaseRow1 {...contentHeader.headerProps} /> : null}
                <BaseTable1 {...nextContentProps} />
            </View>
        );
    }

    render() {
        const { type } = this.props;
        this.sortData();
        switch (type) {
            case 'fix':
                return this._renderFixTable();
            case 'title':
                return this._renderTitleTable();
            default:
                return null;
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    titlecontainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
    },
    fixcontainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#00000000'
    },
    leftcontainer: {
        flexDirection: 'column',
        backgroundColor: '#00000000'
    },
    rightcontainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#00000000'
    }
});
