export const stringToRGB = color => {
    let r, g, b;
    if (color.length === 4) {
        //4位颜色处理,简写模式
        r = parseInt(color.substring(1, 2) + color.substring(1, 2), 16);
        g = parseInt(color.substring(2, 3) + color.substring(2, 3), 16);
        b = parseInt(color.substring(3) + color.substring(3), 16);
    } else {
        //7位颜色字符串处理
        r = parseInt(color.substring(1, 3), 16);
        g = parseInt(color.substring(3, 5), 16);
        b = parseInt(color.substring(5), 16);
    }
    return [r, g, b];
};

export const transformColorToTransparency = (color, trans) => {
    if (trans) return color + trans;
    if (color) return `${color}22`;
    return '#00000000'; //默认给透明
};
