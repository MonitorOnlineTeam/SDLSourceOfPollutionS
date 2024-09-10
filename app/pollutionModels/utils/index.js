import coordinate from '../../utils/coordinate';
import moment from 'moment';
import { CURRENT_PROJECT } from '../../config/globalconst';

/**
 * 循环列表 判断列表中的站点是否报警
 */
export const checkAlarmByPointList = (PointList, key, realTimeAlarms) => {
    if (PointList) {
        PointList.map(item => {
            item.Alarm = checkAlarmByMN(item[key], realTimeAlarms);
        });
    }
};

/**
 * 根据DGIMN判断是否报警 是则返回报警信息
 * @param {*} DGIMN
 */
export const checkAlarmByMN = (DGIMN, realTimeAlarms) => {
    if (realTimeAlarms) {
        return realTimeAlarms.find(alarm => {
            return alarm.DGIMN == DGIMN;
        });
    }
    return null;
};

/**
 * 循环列表 判断列表中的企业是否报警
 */
export const checkAlarmByTargetList = (TargetList, key, realTimeAlarms) => {
    if (TargetList) {
        TargetList.map(item => {
            item.Alarm = checkAlarmByTargetID(item[key], realTimeAlarms);
        });
    }
};

/**
 * 根据DGIMN判断是否报警 是则返回报警信息
 * @param {*} DGIMN
 */
export const checkAlarmByTargetID = (TargetID, realTimeAlarms) => {
    if (realTimeAlarms) {
        return realTimeAlarms.find(alarm => {
            // return alarm.TargetId == TargetID;
            return alarm.entCode == TargetID;
        });
    }
    return null;
};

/**
 * 根据数据 _params 获取数据的状态
 * data 数据
 * code 需要的监测因子编码
 * defaultColor 默认的颜色
 */
export const getDataStatusByData = (data, code, defaultColor = '#00000000') => {
    const result = getDataStatusByParams(data[`${code}_params`]);
    if (result) return result;
    return { color: defaultColor, dis: '默认' };
};

/** 根据数据的参数 获取数据的状态 */
export const getDataStatusByParams = paramStr => {
    if (paramStr) {
        const params = paramStr.split('§');
        if (params) {
            if (params[0] == 0) {
                return { color: '#f04d4d', dis: params[2] };
            } else if (params[0] == 1) {
                return { color: '#ee9944', dis: params[2] };
            }
        }
    }
    return null;
};

/** 根据站点状态code获取站点需要展示的颜色 文字 等信息 */
export const getStatusByCode = code => {
    if (code == 0 || code == '0') {
        return { color: '#999999', code: 0, name: '离线' };
    } else if (code == 1 || code == '1') {
        return { color: '#34c066', code: 1, name: '在线' };
    } else if (code == 2 || code == '2') {
        return { color: '#f04d4d', code: 2, name: '超标' };
    } else if (code == 3 || code == '3') {
        return { color: '#ee9944', code: 3, name: '异常' };
    } else return { color: '#ffffff', code: 3, name: '未知' };
};

/**
 * 根据监控标类型 获取地图上的图片
 * @param {*} type
 */
export const getTargetImageByType = type => {
    if (type == 1 || type == '1') {
        //企业
        return {
            image_circle: require('../../images/ic_xj_ent_circle.png'),
            image: require('../../images/ic_xj_ent.png'),
            name: '企业'
        };
    } else if (type == 3 || type == '3') {
        //河段
        return {
            image_circle: require('../../images/ic_river_circle.png'),
            image: require('../../images/ic_river_circle.png'),
            name: '河段'
        };
    } else if (type == 2 || type == '2') {
        //大气站
        return {
            image_circle: require('../../images/ic_monitoring_station.png'),
            image: require('../../images/ic_monitoring_station.png'),
            name: '大气站'
        };
    } else if (type == 4 || type == '4') {
        //工地
        return {
            image_circle: require('../../images/ic_site_circle.png'),
            image: require('../../images/ic_site.png'),
            name: '工地'
        };
    } else {
        return {
            image_circle: require('../../images/ic_ent_circle.png'),
            image: require('../../images/ic_ent_circle.png'),
            name: '未配置'
        };
    }
};

/**
 * 根据污染物类型（废水废气）找到对应的图标
 * {
 *  image_circle 外面带有圆圈的图标
 *  image 圆圈里面的图标
 * }
 */
export const getImageByType = type => {
    if (type == 1 || type == '1') {
        //废水
        return {
            image_circle: require('../../images/ic_water_circle.png'),
            image: require('../../images/ic_water.png'),
            name: '废水排口'
        };
    } else if (type == 2 || type == '2') {
        //废气
        return {
            image_circle: require('../../images/ic_gas_circle.png'),
            image: require('../../images/ic_gas.png'),
            name: '废气排口'
        };
    } else if (type == 12 || type == '12') {
        //扬尘
        return {
            image_circle: require('../../images/ic_dust_circle.png'),
            image: require('../../images/ic_dust.png'),
            name: '扬尘'
        };
    } else if (type == 10 || type == '10') {
        //VOC
        return {
            image_circle: require('../../images/ic_voc_circle.png'),
            image: require('../../images/ic_voc.png'),
            name: 'VOC'
        };
    } else if (type == 5 || type == '5') {
        //大气检测站
        return {
            image_circle: require('../../images/ic_monitoring_station.png'),
            image: require('../../images/ic_monitoring_station.png'),
            name: 'VOC'
        };
    } else if (type == 37 || type == '37') {
        //大气检测站
        return {
            image_circle: require('../../images/ic_total_electricity.png'),
            image: require('../../images/ic_total_electricity.png'),
            name: '用电量'
        };
    } else {
        return {
            image_circle: require('../../images/icon_location.png'),
            image: require('../../images/icon_location.png'),
            name: '未配置'
        };
    }
};

/**
 * 获取企业厂界 以及region
 * 将厂区图数据重新组装成app需要的格式 并且 算出地图需要显示的范围
 *
 * @param {*} coordinates coordinates格式[[[[lng,lat]]]]
 *
 * 返回结果 {lines,region} 或者 null
 */
export const GetEntCoordinates = coordinates => {
    coordinates = eval(coordinates);
    let region = null; //算出地图范围
    const lines = []; //重新组装数据
    if (coordinates && coordinates.length > 0) {
        const points = [];
        coordinates.map(line => {
            const myLine = [];
            line[0].map(point => {
                myLine.push({
                    latitude: point[1],
                    longitude: point[0]
                });
                points.push({
                    latitude: point[1],
                    longitude: point[0]
                });
            });
            lines.push(myLine);
        });
        if (points && points.length > 0) {
            region = coordinate.getRegionByPoints(points, 'longitude', 'latitude'); //算出经纬度范围来

            //加了一个随机数 因为展示同一个企业，厂界相同 ，model里面region不变，界面render地图region无效
            if (region && region.longitude) {
                region.longitude = region.longitude + Math.random() * 0.0001;
            }
        }
    }
    return {
        lines,
        region
    };
};

//获取 设备资料库地址

export const getInformationBankOfEquipmentFileUrl = (fileName, prefixStr) => {
    if (fileName == '' || prefixStr == '') {
        return '';
    }
    return `${prefixStr}${fileName}`;
};

export const getAQIColor = iaqi => {
    if (iaqi > 0 && iaqi <= 50) {
        return '#4cd077';
    } else if (iaqi > 50 && iaqi <= 100) {
        return '#fdd22a';
    } else if (iaqi > 100 && iaqi <= 150) {
        return '#f49d15';
    } else if (iaqi > 150 && iaqi <= 200) {
        return '#f17171';
    } else if (iaqi > 200 && iaqi <= 300) {
        return '#d05696';
    } else if (iaqi > 300 && iaqi < 500) {
        return '#a14458';
    } else if (iaqi >= 500) {
        //爆表
        return '#000000';
    }
    return '#ddd';
};
