import {DEBUG} from '../config';

/**
 * 第一级别
 * 发布模式下打印
 * @param {*} str
 */
export const logrelease = (str)=>{
    console.log(str);
};

/**
 * 第二级别
 * 调试模式下打印
 * @param {*} str 
 */
export const logdebug = (str)=>{
    if(DEBUG){
        console.log(str);
    }
};