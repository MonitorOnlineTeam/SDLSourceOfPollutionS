import moment from 'moment';
/**
 * 图例背景色  异常 离线 优 良 轻度 中度 重度 严重 爆表
 * @param {*} lengendCode
 */
export const mapLengedBack = lengendCode => {
    switch (lengendCode) {
        case 'l001':
            return '#489ae3';
        case 'l002':
            return '#ababab';
        case 'l003':
            return '#03d304';
        case 'l004':
            return '#efdc31';
        case 'l005':
            return '#ffaa00';
        case 'l006':
            return '#ff401a';
        case 'l007':
            return '#d20040';
        case 'l008':
            return '#9c0a4e';
        case 'l009':
            return '#16010b';
    }
};
/**
 * 图例前景色  异常 离线 优 良 轻度 中度 重度 严重 爆表
 * @param {*} lengendCode
 */
export const mapLengedFore = lengendCode => {
    switch (lengendCode) {
        case 'l001':
        case 'l002':
        case 'l003':
        case 'l004':
        case 'l005':
            return '#333333';
        case 'l006':
        case 'l007':
        case 'l008':
        case 'l009':
            return '#eeeeee';
    }
};

/**
 * 地图图例 设备类型 形状 颜色
 * @param {*} equitmentCode
 */
export const mapEuitment = equitmentCode => {
    //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
    //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
    switch (equitmentCode) {
        case '30':
            return [{ uri: 'lcs_l000' }, { uri: 'lcs_l001' }, { uri: 'lcs_l002' }, { uri: 'lcs_l003' }, { uri: 'lcs_l004' }, { uri: 'lcs_l005' }, { uri: 'lcs_l006' }, { uri: 'lcs_l007' }, { uri: 'lcs_l008' }, { uri: 'lcs_l009' }];
        case '18':
            return [{ uri: 'klw_l000' }, { uri: 'klw_l001' }, { uri: 'klw_l002' }, { uri: 'klw_l003' }, { uri: 'klw_l004' }, { uri: 'klw_l005' }, { uri: 'klw_l006' }, { uri: 'klw_l007' }, { uri: 'klw_l008' }, { uri: 'klw_l009' }];
        case '26':
            return [
                { uri: 'xskqz_l000' },
                { uri: 'xskqz_l001' },
                { uri: 'xskqz_l002' },
                { uri: 'xskqz_l003' },
                { uri: 'xskqz_l004' },
                { uri: 'xskqz_l005' },
                { uri: 'xskqz_l006' },
                { uri: 'xskqz_l007' },
                { uri: 'xskqz_l008' },
                { uri: 'xskqz_l009' }
            ];
        case '28':
            return [{ uri: 'voc_l000' }, { uri: 'voc_l001' }, { uri: 'voc_l002' }, { uri: 'voc_l003' }, { uri: 'voc_l004' }, { uri: 'voc_l005' }, { uri: 'voc_l006' }, { uri: 'voc_l007' }, { uri: 'voc_l008' }, { uri: 'voc_l009' }];
        case '29':
        case '12':
            return [{ uri: 'yczs_l000' }, { uri: 'yczs_l001' }, { uri: 'yczs_l002' }, { uri: 'yczs_l003' }, { uri: 'yczs_l004' }, { uri: 'yczs_l005' }, { uri: 'yczs_l006' }, { uri: 'yczs_l007' }, { uri: 'yczs_l008' }, { uri: 'yczs_l009' }];
        // case '32':
        // break;
        case '27':
            return [{ uri: 'ou_l000' }, { uri: 'ou_l001' }, { uri: 'ou_l002' }, { uri: 'ou_l003' }, { uri: 'ou_l004' }, { uri: 'ou_l005' }, { uri: 'ou_l006' }, { uri: 'ou_l007' }, { uri: 'ou_l008' }, { uri: 'ou_l009' }];
        case '34':
            return [
                { uri: 'cgkqz_l000' },
                { uri: 'cgkqz_l001' },
                { uri: 'cgkqz_l002' },
                { uri: 'cgkqz_l003' },
                { uri: 'cgkqz_l004' },
                { uri: 'cgkqz_l005' },
                { uri: 'cgkqz_l006' },
                { uri: 'cgkqz_l007' },
                { uri: 'cgkqz_l008' },
                { uri: 'cgkqz_l009' }
            ];
        case '35':
            return [
                { uri: 'lcs_voc_l000' },
                { uri: 'lcs_voc_l001' },
                { uri: 'lcs_voc_l002' },
                { uri: 'lcs_voc_l003' },
                { uri: 'lcs_voc_l004' },
                { uri: 'lcs_voc_l005' },
                { uri: 'lcs_voc_l006' },
                { uri: 'lcs_voc_l007' },
                { uri: 'lcs_voc_l008' },
                { uri: 'lcs_voc_l009' }
            ];
        case '23':
            return [{ uri: 'gk_l000' }, { uri: 'gk_l001' }, { uri: 'gk_l002' }, { uri: 'gk_l003' }, { uri: 'gk_l004' }, { uri: 'gk_l005' }, { uri: 'gk_l006' }, { uri: 'gk_l007' }, { uri: 'gk_l008' }, { uri: 'gk_l009' }];
        case '24':
            return [{ uri: 'sk_l000' }, { uri: 'sk_l001' }, { uri: 'sk_l002' }, { uri: 'sk_l003' }, { uri: 'sk_l004' }, { uri: 'sk_l005' }, { uri: 'sk_l006' }, { uri: 'sk_l007' }, { uri: 'sk_l008' }, { uri: 'sk_l009' }];
        case '25':
            return [{ uri: 'shik_l000' }, { uri: 'shik_l001' }, { uri: 'shik_l002' }, { uri: 'shik_l003' }, { uri: 'shik_l004' }, { uri: 'shik_l005' }, { uri: 'shik_l006' }, { uri: 'shik_l007' }, { uri: 'shik_l008' }, { uri: 'shik_l009' }];
    }
};

/**
 * 地图设备类型 形状 颜色
 * @param {*} equitmentCode
 */
export const mapEuitmentImage = equitmentCode => {
    //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
    //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；12扬尘
    switch (equitmentCode) {
        case '30':
            return ['lcs_l000', 'lcs_l001', 'lcs_l002', 'lcs_l003', 'lcs_l004', 'lcs_l005', 'lcs_l006', 'lcs_l007', 'lcs_l008', 'lcs_l009'];
        case '18':
            return ['klw_l000', 'klw_l001', 'klw_l002', 'klw_l003', 'klw_l004', 'klw_l005', 'klw_l006', 'klw_l007', 'klw_l008', 'klw_l009'];
        case '26':
            return ['xskqz_l000', 'xskqz_l001', 'xskqz_l002', 'xskqz_l003', 'xskqz_l004', 'xskqz_l005', 'xskqz_l006', 'xskqz_l007', 'xskqz_l008', 'xskqz_l009'];
        case '28':
            return ['voc_l000', 'voc_l001', 'voc_l002', 'voc_l003', 'voc_l004', 'voc_l005', 'voc_l006', 'voc_l007', 'voc_l008', 'voc_l009'];
        case '29':
            return ['yczs_l000', 'yczs_l001', 'yczs_l002', 'yczs_l003', 'yczs_l004', 'yczs_l005', 'yczs_l006', 'yczs_l007', 'yczs_l008', 'yczs_l009'];
        // case '32':
        // break;
        case '27':
            return ['ou_l000', 'ou_l001', 'ou_l002', 'ou_l003', 'ou_l004', 'ou_l005', 'ou_l006', 'ou_l007', 'ou_l008', 'ou_l009'];
        case '34':
            return ['cgkqz_l000', 'cgkqz_l001', 'cgkqz_l002', 'cgkqz_l003', 'cgkqz_l004', 'cgkqz_l005', 'cgkqz_l006', 'cgkqz_l007', 'cgkqz_l008', 'cgkqz_l009'];
        case '35':
            return ['lcs_voc_l000', 'lcs_voc_l001', 'lcs_voc_l002', 'lcs_voc_l003', 'lcs_voc_l004', 'lcs_voc_l005', 'lcs_voc_l006', 'lcs_voc_l007', 'lcs_voc_l008', 'lcs_voc_l009'];
        case '23':
            return ['gk_l000', 'gk_l001', 'gk_l002', 'gk_l003', 'gk_l004', 'gk_l005', 'gk_l006', 'gk_l007', 'gk_l008', 'gk_l009'];
        case '24':
            return ['sk_l000', 'sk_l001', 'sk_l002', 'sk_l003', 'sk_l004', 'sk_l005', 'sk_l006', 'sk_l007', 'sk_l008', 'sk_l009'];
        case '25':
            return ['shik_l000', 'shik_l001', 'shik_l002', 'shik_l003', 'shik_l004', 'shik_l005', 'shik_l006', 'shik_l007', 'shik_l008', 'shik_l009'];
        case '12':
            return ['yczs_l000', 'yczs_l001', 'yczs_l002', 'yczs_l003', 'yczs_l004', 'yczs_l005', 'yczs_l006', 'yczs_l007', 'yczs_l008', 'yczs_l009'];
        case '32':
            return ['jcc_l000', 'jcc_l001', 'jcc_l002', 'jcc_l003', 'jcc_l004', 'jcc_l005', 'jcc_l006', 'jcc_l007', 'jcc_l008', 'jcc_l009'];
    }
};
/**
 *  AQI 级别对应污染描述  异常 离线 优 良 轻度 中度 重度 严重 爆表
 * @param {*}  //0,50, 100, 150, 200, 300, 499 --0：异常
 */
export const valueAQIText = value => {
    if (value == 0) {
        return '异常';
    } else if (value > 0 && value <= 50) {
        return '优';
    } else if (value > 50 && value <= 100) {
        return '良';
    } else if (value > 100 && value <= 150) {
        return '轻度';
    } else if (value > 150 && value <= 200) {
        return '中度';
    } else if (value > 200 && value <= 300) {
        return '重度';
    } else if (value > 300 && value <= 499) {
        return '严重';
    } else if (value > 499) {
        return '爆表';
    }
};
/**
 *  AQI 级别对应污染颜色  异常 离线 优 良 轻度 中度 重度 严重 爆表
 * @param {*}  //0,50, 100, 150, 200, 300, 499 --0：异常
 */
export const valueAQIColor = value => {
    if (value == 0) {
        return '#489ae3';
    } else if (value > 0 && value <= 50) {
        return '#03d304';
    } else if (value > 50 && value <= 100) {
        return '#efdc31';
    } else if (value > 100 && value <= 150) {
        return '#ffaa00';
    } else if (value > 150 && value <= 200) {
        return '#ff401a';
    } else if (value > 200 && value <= 300) {
        return '#d20040';
    } else if (value > 300 && value <= 499) {
        return '#9c0a4e';
    } else if (value > 499) {
        return '#16010b';
    }
};

/**
 * TVOC 对应颜色
 * @param {*} value
 */
export const valueTVOCColor = value => {
    //0,50, 100, 150, 200, 300, 499 --0：异常
    if (value == 0) {
        return '#489ae3';
    } else if (value > 0 && value <= 50) {
        return '#03d304';
    } else if (value > 50 && value <= 100) {
        return '#efdc31';
    } else if (value > 100 && value <= 150) {
        return '#ffaa00';
    } else if (value > 150 && value <= 200) {
        return '#ff401a';
    } else if (value > 200 && value <= 300) {
        return '#d20040';
    } else if (value > 300) {
        return '#9c0a4e';
    } else {
        return '#ffffff';
    }
};

/**
 * IAQI 级别对应污染程度-图标
 * @param {*} value
 */
export const IAQILevel = value => {
    //0,50, 100, 150, 200, 300, 499 --0：异常
    if (value == 0) {
        return 2;
    } else if (value > 0 && value <= 50) {
        return 3;
    } else if (value > 50 && value <= 100) {
        return 4;
    } else if (value > 100 && value <= 150) {
        return 5;
    } else if (value > 150 && value <= 200) {
        return 6;
    } else if (value > 200 && value <= 300) {
        return 7;
    } else if (value > 300 && value <= 499) {
        return 8;
    } else if (value > 499) {
        return 9;
    }
};

/**
 * TVOC 级别对应污染程度-图标
 * @param {*} value
 */
export const TVOCLevel = value => {
    //0,50, 100, 150, 200, 300, 499 --0：异常
    if (value == 0) {
        return 2;
    } else if (value > 0 && value <= 4) {
        return 3;
    } else if (value > 4) {
        return 6;
    }
};

/**
 * 氨 NH3 级别对应污染程度-图标
 * @param {*} value
 */
export const NH3Level = value => {
    //0, 1.0, 2.0, 5.0  --0：异常
    if (value == 0) {
        return { level: 2, color: ['#489ae3', '#333333'] };
    } else if (value > 0 && value <= 1000) {
        return { level: 3, color: ['#03d304', '#333333'] };
    } else if (value > 1000 && value <= 2000) {
        return { level: 4, color: ['#efdc31', '#333333'] };
    } else if (value > 2000) {
        return { level: 6, color: ['#ff401a', '#333333'] };
    }
};

/**
 * 硫化氢 H2S 级别对应污染程度-图标
 * @param {*} value
 */
export const H2SLevel = value => {
    //0, 0.03, 0.1, 0.6  --0：异常
    if (value == 0) {
        return { level: 2, color: ['#489ae3', '#333333'] };
    } else if (value > 0 && value <= 30) {
        return { level: 3, color: ['#03d304', '#333333'] };
    } else if (value > 30 && value <= 100) {
        return { level: 4, color: ['#efdc31', '#333333'] };
    } else if (value > 100) {
        return { level: 6, color: ['#ff401a', '#333333'] };
    }
};
/**
 * 臭气浓度 OU 级别对应污染程度-图标
 * @param {*} value
 */
export const OULevel = value => {
    //0,10, 30, 70  --0：异常
    if (value == 0) {
        return { level: 2, color: ['#489ae3', '#333333'] };
    } else if (value > 0 && value <= 10) {
        return { level: 3, color: ['#03d304', '#333333'] };
    } else if (value > 10 && value <= 30) {
        return { level: 4, color: ['#efdc31', '#333333'] };
    } else if (value > 30) {
        return { level: 6, color: ['#ff401a', '#333333'] };
    }
};

/**
 * 噪声 OU 级别对应污染程度-图标
 * @param {*} value
 */
export const ZSLevel = value => {
    // if(moment().format('HH:00:00')>='06:00:00'){

    // }
    if (value == 0) {
        return { level: 2, color: ['#489ae3', '#333333'] };
    } else if (value > 0 && value <= 50) {
        return { level: 3, color: ['#03d304', '#333333'] };
    } else if (value >= 51 && value <= 55) {
        return { level: 4, color: ['#efdc31', '#333333'] };
    } else if (value >= 56 && value <= 60) {
        return { level: 5, color: ['#ffaa00', '#333333'] };
    } else if (value >= 61 && value <= 65) {
        return { level: 6, color: ['#ff401a', '#eeeeee'] };
    } else if (value > 65) {
        return { level: 7, color: ['#d20040', '#eeeeee'] };
    }
};

/**
 * IAQI 级别对应污染程度-前景色 背景色
 * @param {*} value
 */
export const IAQIColorLevel = value => {
    //0,50, 100, 150, 200, 300, 499 --0：异常
    if (value == 0) {
        return ['#489ae3', '#333333'];
    } else if (value > 0 && value <= 50) {
        return ['#03d304', '#333333'];
    } else if (value > 50 && value <= 100) {
        return ['#efdc31', '#333333'];
    } else if (value > 100 && value <= 150) {
        return ['#ffaa00', '#333333'];
    } else if (value > 150 && value <= 200) {
        return ['#ff401a', '#eeeeee'];
    } else if (value > 200 && value <= 300) {
        return ['#d20040', '#eeeeee'];
    } else if (value > 300 && value <= 499) {
        return ['#9c0a4e', '#eeeeee'];
    } else if (value > 499) {
        return ['#16010b', '#eeeeee'];
    } else {
        return ['#ffffff', '#333333'];
    }
};

/**
 * TVOC 对应前景色 背景色
 * @param {*} value
 */
export const TVOCColorLevel = value => {
    //0,50, 100, 150, 200, 300, 499 --0：异常
    if (value == 0) {
        return ['#489ae3', '#333333'];
    } else if (value > 0 && value <= 50) {
        return ['#03d304', '#333333'];
    } else if (value > 50 && value <= 100) {
        return ['#efdc31', '#333333'];
    } else if (value > 100 && value <= 150) {
        return ['#ffaa00', '#333333'];
    } else if (value > 150 && value <= 200) {
        return ['#ff401a', '#eeeeee'];
    } else if (value > 200 && value <= 300) {
        return ['#d20040', '#eeeeee'];
    } else if (value > 300) {
        return ['#9c0a4e', '#eeeeee'];
    } else {
        return ['#ffffff', '#333333'];
    }
};

/**
 * 获取污染因子是 AQI 还是IAQI
 * @param {*} pollutantCode
 */
export const AQIorIAQI = pollutantCode => {
    if (pollutantCode == 'AQI') {
        return 'AQI';
    } else if (pollutantCode == 'a99054') {
        //TVOC
        return 'a99054';
    } else if (pollutantCode == 'ou') {
        //恶臭
        return 'ou';
    } else if (pollutantCode == 'a21001') {
        //氨气
        return 'a21001';
    } else if (pollutantCode == 'a21028') {
        //硫化氢
        return 'a21028';
    } else if (pollutantCode == 'leq') {
        //噪声
        return 'leq';
    } else {
        return pollutantCode + '_IAQI';
    }
};

/**
 * EquitmentStatus 设备状态
 * @param {*} status 0离线；3异常；1,2在线超标
 */
export const statusImage = status => {
    switch (status) {
        case 0:
            return 1;
        case 3:
            return 2;
        default:
            return -1;
    }
};
/**
 * 根据设备类型找到所有监测名称以及监测因子
 * @param {*} equitmentCode
 */
//    export const kindCode=(equitmentCode)=>{
//         //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
//    //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
//            switch(equitmentCode){
//                    case '30':
//                    return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024","a01001", "a01002"],
//                            ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"温度", "湿度"]];
//                    case '18':
//                    return [["a34004", "a34002"],
//                            ['PM25', 'PM10']];
//                    case '26':
//                    return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024"],
//                            ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3']];
//                    case '28':
//                    return [['a99054'],
//                            ['TVOC']];
//                    case '29':
//                    return [["a34002", "a34004", "a34001", "a01015","a01001", "a01002", "a01006", "a01007", "a01008"],
//                            ['PM10', 'PM25', "TSP", "噪声","温度", "湿度", "气压", "风速", "风向"]];
//                    case '32':
//                    return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024","a00018", "a00017"],
//                            ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"H2S", "NH3"]];
//                    case '27':
//                    return [["ecdj", "a05", "a00017", "a06", "a21089", 'a99054'],
//                            ["恶臭等级", "H2S", "NH3", "OU", "恶臭强度", 'TVOC']];
//                    case '34':
//                    case '23':
//                    case '24':
//                    case '25':
//                    return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024", "a01001", "a01002", "a01006", "a01007", "a01008"],
//                            ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"温度", "湿度", "气压", "风速", "风向"]];
//                    case '35':
//                    return [['AQI', "a34004", "a34002", "a21004", "a21026", "a21005", "a05024","a01001", "a01002", 'a99054'],
//                            ['AQI', 'PM25', 'PM10', 'NO2', 'SO2', "CO", 'O3',"温度", "湿度", 'TVOC']];
//            }
//    }
/**
 * 根据设备类型找到所有监测名称以及监测因子
 * @param {*} equitmentCode
 */
export const kindAndCode = equitmentCode => {
    //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
    //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
    switch (equitmentCode) {
        case '30':
            return [
                { pname: 'AQI', pcode: 'AQI' },
                { pname: 'PM25', pcode: 'a34004' },
                { pname: 'PM10', pcode: 'a34002' },
                { pname: 'NO2', pcode: 'a21004' },
                { pname: 'SO2', pcode: 'a21026' },
                { pname: 'CO', pcode: 'a21005' },
                { pname: 'O3', pcode: 'a05024' },
                { pname: '温度', pcode: 'a01001' },
                { pname: '湿度', pcode: 'a01002' }
            ];
        case '18':
            return [{ pname: 'PM25', pcode: 'a34004' }, { pname: 'PM10', pcode: 'a34002' }];
        case '26':
            return [
                { pname: 'AQI', pcode: 'AQI' },
                { pname: 'PM25', pcode: 'a34004' },
                { pname: 'PM10', pcode: 'a34002' },
                { pname: 'NO2', pcode: 'a21004' },
                { pname: 'SO2', pcode: 'a21026' },
                { pname: 'CO', pcode: 'a21005' },
                { pname: 'O3', pcode: 'a05024' }
            ];
        case '28':
            return [{ pname: 'TVOC', pcode: 'a99054' }];
        case '29':
            return [
                { pname: 'PM25', pcode: 'a34004' },
                { pname: 'PM10', pcode: 'a34002' },
                { pname: 'TSP', pcode: 'a34001' },
                { pname: '噪声', pcode: 'a01015' },
                { pname: '温度', pcode: 'a01001' },
                { pname: '湿度', pcode: 'a01002' },
                { pname: '气压', pcode: 'a01006' },
                { pname: '风速', pcode: 'a01007' },
                { pname: '风向', pcode: 'a01008' }
            ];
        case '32':
            return [
                { pname: 'AQI', pcode: 'AQI' },
                { pname: 'PM25', pcode: 'a34004' },
                { pname: 'PM10', pcode: 'a34002' },
                { pname: 'NO2', pcode: 'a21004' },
                { pname: 'SO2', pcode: 'a21026' },
                { pname: 'CO', pcode: 'a21005' },
                { pname: 'O3', pcode: 'a05024' },
                { pname: 'H2S', pcode: 'a00018' },
                { pname: 'NH3', pcode: 'a00017' }
            ];
        case '27':
            return [{ pname: '恶臭等级', pcode: 'ecdj' }, { pname: 'H2S', pcode: 'a05' }, { pname: 'NH3', pcode: 'a00017' }, { pname: 'OU', pcode: 'a06' }, { pname: '恶臭强度', pcode: 'a21089' }, { pname: 'TVOC', pcode: 'a99054' }];
        case '34':
        case '23':
        case '24':
        case '25':
            return [
                { pname: 'AQI', pcode: 'AQI' },
                { pname: 'PM25', pcode: 'a34004' },
                { pname: 'PM10', pcode: 'a34002' },
                { pname: 'NO2', pcode: 'a21004' },
                { pname: 'SO2', pcode: 'a21026' },
                { pname: 'CO', pcode: 'a21005' },
                { pname: 'O3', pcode: 'a05024' },
                { pname: '温度', pcode: 'a01001' },
                { pname: '湿度', pcode: 'a01002' },
                { pname: '气压', pcode: 'a01006' },
                { pname: '风速', pcode: 'a01007' },
                { pname: '风向', pcode: 'a01008' }
            ];
        case '35':
            return [
                { pname: 'AQI', pcode: 'AQI' },
                { pname: 'PM25', pcode: 'a34004' },
                { pname: 'PM10', pcode: 'a34002' },
                { pname: 'NO2', pcode: 'a21004' },
                { pname: 'SO2', pcode: 'a21026' },
                { pname: 'CO', pcode: 'a21005' },
                { pname: 'O3', pcode: 'a05024' },
                { pname: '温度', pcode: 'a01001' },
                { pname: '湿度', pcode: 'a01002' },
                { pname: 'TVOC', pcode: 'a99054' }
            ];
        case '12':
            return [{ pname: 'PM25', pcode: 'a34004' }, { pname: 'PM10', pcode: 'a34002' }, { pname: 'NO2', pcode: 'a21004' }, { pname: '温度', pcode: 'a01001' }, { pname: '湿度', pcode: 'a01002' }];
    }
};
/**
 * 根据设备类型找到默认监测因子
 * @param {*} equitmentCode
 */
export const kindMRCode = equitmentCode => {
    //"23"-国控点；"24"-省控点；"25"-市控点； "26"-小型空气站.；"27"-恶臭监测站；"28"-VOC微型站；
    //"29"-扬尘噪声小型站；"30"-六参数微型站；"32"-移动监测车；"34"-大气常规站； "35"-六参数及VOC； "18"-颗粒物；
    switch (equitmentCode) {
        case '30':
            return 'AQI';
        case '18':
            return 'a34004';
        case '26':
            return 'AQI';
        case '28':
            return 'a99054';
        case '29':
            return 'a34002';
        case '32':
            return 'AQI';
        case '27':
            return 'ecdj';
        case '34':
        case '23':
        case '24':
        case '25':
            return 'AQI';
        case '35':
            return 'AQI';
        case '12':
            return 'AQI';
    }
};
/**
 * 监测因子对应监测名称
 * @param {*} equitmentCode
 */
export const CodeForName = (pollutantCode, pollutantType) => {
    switch (pollutantCode) {
        case 'AQI':
            return 'AQI';

        case 'a34004':
            return 'PM2.5';

        case 'a34002':
            return 'PM10';

        case 'a21004':
            return 'NO2';

        case 'a21026':
            return 'SO2';

        case 'a21005':
            return 'CO';

        case 'a05024':
            return 'O3';

        case 'a99054':
            return 'TVOC';

        case 'a01015':
            return '噪声';

        case 'leq':
            return '噪声';

        case 'a34001':
            return 'TSP';

        case 'a01001':
            return '温度';

        case 'a01002':
            return '湿度';

        case 'a01006':
            return '气压';

        case 'a01007':
            if (pollutantType == '23' || pollutantType == '24' || pollutantType == '25') {
                return '风级';
            } else {
                return '风速';
            }
        case 'a01008':
            return '风向';

        case 'a00017':
            return 'NH3';

        case 'a00018':
            return 'H2S';

        case 'ou':
            return 'OU';

        case 'a21089':
            return '恶臭强度';

        case 'a21001':
            return '氨气';

        case 'a21028':
            return '硫化氢';

        case 'lng':
            return '经度';

        case 'lat':
            return '纬度';

        default:
            return '';
    }
};
/**
 * 监测名称对应监测因子
 * @param {*} equitmentCode
 */
export const NameForCode = (pollutantCode, pollutantType) => {
    switch (pollutantCode) {
        case 'AQI':
            return 'AQI';

        case 'a34004':
            return 'PM25';

        case 'a34002':
            return 'PM10';

        case 'a21004':
            return 'NO2';

        case 'a21026':
            return 'SO2';

        case 'a21005':
            return 'CO';

        case 'a05024':
            return 'O3';

        case 'a99054':
            return 'TVOC';

        case 'a01015':
            return '噪声';

        case 'a340102':
            return 'TSP';

        case 'a01001':
            return '温度';

        case 'a01002':
            return '湿度';

        case 'a01006':
            return '气压';

        case 'a01007':
            if (pollutantType == '23' || pollutantType == '24' || pollutantType == '25') {
                return '风级';
            } else {
                return '风速';
            }
        case 'a01008':
            return '风向';

        case 'a00017':
            return 'NH3';

        case 'a00018':
            return 'H2S';

        case '6':
            return 'OU';

        case 'a21089':
            return '恶臭强度';

        case 'lng':
            return '经度';

        case 'lat':
            return '纬度';

        default:
            return '';
    }
};
/**
 * 监测因子对应监测单位
 * @param {*} equitmentCode
 */
export const RealCodeForUnit = (pollutantCode, pollutantType) => {
    switch (pollutantCode) {
        // case 'AQI':
        // return 'AQI';

        // case 'a34004':
        // return 'PM25';

        // case 'a34002':
        // return 'PM10';

        // case 'a21004':
        // return 'NO2';

        // case 'a21026':
        // return 'SO2';

        // case 'a21005':
        // return 'CO';

        // case 'a05024':
        // return 'O3';

        // case 'a99054':
        // return 'TVOC';

        // case 'a01015':
        // return '噪声';

        // case 'a340102':
        // return 'TSP';

        case 'a01001':
            return '℃';

        case 'a01002':
            return '%';

        case 'a01006':
            return 'hpa';

        case 'a01008':
            return 'deg';
        case 'a05024':
            return 'mg/m³';
        case 'a21004':
            return 'mg/m³';
        case 'a21005':
            return 'mg/m³';
        case 'a21026':
            return 'mg/m³';
        case 'a34002':
            return 'μg/m³';
        case 'a34004':
            return 'μg/m³';
        case 'a99054':
            return 'μg/m³';

        case 'a01007':
            if (pollutantType == '23' || pollutantType == '24' || pollutantType == '25') {
                return '级';
            } else {
                return 'm/s';
            }

        // case 'a01008':
        // return '风向';

        // case 'a00017':
        // return 'NH3';

        // case 'a00018':
        // return 'H2S';

        // case '6':
        // return 'OU';

        // case 'a21089':
        // return '恶臭强度';

        default:
            return '';
    }
};

export const PollutantStandard = {
    WindSpeed: { code: 'a01007', name: '风速', standard: 'a01007' },
    WindDirection: { code: 'a01007', name: '风向', standard: 'a01008' },
    PM25: { code: 'a34004', name: 'PM25', standard: 'a34004' },
    PM10: { code: 'a34002', name: 'PM10', standard: 'a34002' },
    SO2: { code: 'a21026', name: 'SO2', standard: 'a21026' },
    NO2: { code: 'a21004', name: 'NO2', standard: 'a21004' },
    O3: { code: 'a05024', name: 'O3', standard: 'a05024' },
    CO: { code: 'a21005', name: 'CO', standard: 'a21005' }
};

/**
 * 监测因子是否是风速度
 * @param {*} v  风速的中文名字或者code
 */
export const isWindSpeed = v => {
    if (v == '风速' || v == PollutantStandard.WindSpeed.code) return true;
    else return false;
};

/**
 * 监测因子是否是风速度
 * @param {*} v  风向的中文名字或者code
 */
export const isWindDirection = v => {
    if (v == '风向' || v == PollutantStandard.WindDirection.code) return true;
    else return false;
};

/**
 * 获取风速的code
 */
export const getWindSpeed = () => {
    return PollutantStandard.WindSpeed.code;
};

/**
 * 获取风向的code
 */
export const getWindDirection = () => {
    return PollutantStandard.WindDirection.code;
};
/**
 * 监测因子对应监测单位
 * @param {*} value  speed风速
 */
export const WindTransform = (value, sudu) => {
    let speed;
    if (value == null && sudu <= 0.2) {
        speed = '静风';
    } else if ((value >= 0 && value <= 11.25) || (value >= 348.76 && value <= 360)) {
        speed = '北风';
    } else if (value >= 11.26 && value <= 33.75) {
        speed = '东北偏北风';
    } else if (value >= 33.76 && value <= 56.25) {
        speed = '东北风';
    } else if (value >= 56.26 && value <= 78.75) {
        speed = '东北偏东风';
    } else if (value >= 78.76 && value <= 101.25) {
        speed = '东风';
    } else if (value >= 101.26 && value <= 123.75) {
        speed = '东南偏东风';
    } else if (value >= 123.76 && value <= 146.25) {
        speed = '东南风';
    } else if (value >= 146.26 && value <= 168.75) {
        speed = '东南偏南风';
    } else if (value >= 168.76 && value <= 191.25) {
        speed = '南风';
    } else if (value >= 191.26 && value <= 213.75) {
        speed = '西南偏南风';
    } else if (value >= 213.76 && value <= 236.25) {
        speed = '西南风';
    } else if (value >= 236.26 && value <= 258.75) {
        speed = '西南偏西风';
    } else if (value >= 258.76 && value <= 281.25) {
        speed = '西风';
    } else if (value >= 281.76 && value <= 303.75) {
        speed = '西北偏西风';
    } else if (value >= 303.76 && value <= 326.25) {
        speed = '西北风';
    } else if (value >= 326.26 && value <= 348.75) {
        speed = '西北偏北风';
    }
    return speed;
};

/**
 * 获取大气PM2.5的code
 */
export const getAirPM25Code = () => {
    return PollutantStandard.PM25.code;
};

/**
 * 获取大气PM10的code
 */
export const getAirPM10Code = () => {
    return PollutantStandard.PM10.code;
};

/**
 * 获取大气SO2的code
 */
export const getAirSO2Code = () => {
    return PollutantStandard.SO2.code;
};

/**
 * 获取 大气 NO2的code
 */
export const getAirNO2Code = () => {
    return PollutantStandard.NO2.code;
};

/**
 * 获取大气O3的code
 */
export const getAirO3Code = () => {
    return PollutantStandard.O3.code;
};

/**
 * 获取大气CO的code
 */
export const getAirCOCode = () => {
    return PollutantStandard.CO.code;
};

/**
 * 报告类型名字
 * @param {*}
 */
export const ResportTypeHeadTitle = ReporType => {
    switch (ReporType) {
        case '1':
            return '日报';
        case '2':
            return '周报';
        case '3':
            return '月报';
        case '4':
            return '季报';
        case '5':
            return '半年报';
        case '6':
            return '年报';
        case '7':
            return '专项报告';
    }
};

/**
 * 报告列表类型
 * @param {*}
 */
export const ResportTypeImage = ReporType => {
    switch (ReporType) {
        case '1':
            return require('../images/report_day.png');
        case '2':
            return require('../images/report_weak.png');
        case '3':
            return require('../images/report_month.png');
        case '4':
            return require('../images/report_quarter.png');
        case '5':
            return require('../images/report_half_year.png');
        case '6':
            return require('../images/report_year.png');
        case '7':
            return require('../images/report_others.png');
    }
};

/**
 * 报告类型
 * @param {*}
 */
export const ResportTypeHeadImage = ReporType => {
    switch (ReporType) {
        case '1':
            return require('../images/resport_head_day.png');
        case '2':
            return require('../images/resport_head_weak.png');
        case '3':
            return require('../images/resport_head_month.png');
        case '4':
            return require('../images/resport_head_quar.png');
        case '5':
            return require('../images/resport_head_half_year.png');
        case '6':
            return require('../images/resport_head_year.png');
        case '7':
            return require('../images/resport_head_other.png');
    }
};
