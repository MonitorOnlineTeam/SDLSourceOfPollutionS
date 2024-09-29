/**
 * 数字相加
 * @param {*} arg1 
 * @param {*} arg2 
 * @returns 
 */
export function accAdd(arg1, arg2) {
    return changeNum(arg1, arg2)
}

/**
 * 数字相减
 * @param {*} arg1 
 * @param {*} arg2 
 * @returns 
 */
export function accSub(arg1, arg2) {
	return changeNum(arg1, arg2, false)
}

/**
 * 数字相乘
 * @param {*} arg1 
 * @param {*} arg2 
 * @returns 
 */
export function accMul(arg1, arg2) {
	let m = 0;
	m = accAdd(m, getDecimalLength(arg1))
	m = accAdd(m, getDecimalLength(arg2))
	return getNum(arg1) * getNum(arg2) / Math.pow(10, m)
}

/**
 * 数字相除
 * @param {*} arg1 
 * @param {*} arg2 
 * @returns 
 */
export function accDiv(arg1, arg2) {
	let t1, t2;
	t1 = getDecimalLength(arg1)
	t2 = getDecimalLength(arg2)
    if(t1 - t2 > 0) {
        return (getNum(arg1) / getNum(arg2)) / Math.pow(10, t1 - t2)
    } else {
        return (getNum(arg1) / getNum(arg2)) * Math.pow(10, t2 - t1)
    }
}

function changeNum(arg1 = '', arg2 = '', isAdd = true){
    function changeInteger(arg, r, maxR){
        if(r != maxR){
            let addZero = ''
            for(let i = 0; i < maxR - r; i++){
                addZero += '0'
            }
            arg = Number(arg.toString().replace('.', '') + addZero)
        }else{
            arg = getNum(arg)
        }
        return arg
    }
    let r1, r2, maxR, m;
    r1 = getDecimalLength(arg1)
    r2 = getDecimalLength(arg2)
    maxR = Math.max(r1, r2)
    arg1 = changeInteger(arg1, r1, maxR)
    arg2 = changeInteger(arg2, r2, maxR)
    m = Math.pow(10, maxR)
    if(isAdd){
        return (arg1 + arg2) / m
    }else{
        return (arg1 - arg2) / m
    }
}

function getDecimalLength(arg = ''){
    try {
        return arg.toString().split(".")[1].length
    } catch (e) {
        return 0
    }
}

function getNum(arg = ''){
    return Number(arg.toString().replace(".", ""))
}
