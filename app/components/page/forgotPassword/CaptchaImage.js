/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-12-06 15:23:04
 * @LastEditTime: 2024-12-09 14:47:51
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/forgotPassword/CaptchaImage.js
 */
import { TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Surface, Group, Path, Shape, Text, Transform } from '@react-native-community/art';


export default function CaptchaImage({ backFun }) {
    // const baseCharArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    //     , 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'
    //     , 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    //     , 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
    //     , 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    // ];
    // 没有小写l和大写I
    const baseCharArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        , 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n'
        , 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        , 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N'
        , 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    const xArr = [0, 25, 50, 75];

    const [textProps, setTextProps] = useState([]);
    const getRandomNum = () => {
        return (Math.random() * 2 - 1)
    }
    useEffect(() => {
        let objArr = [];
        let tArr = [];
        let index = 0;
        let captchaStr = '';
        [1, 2, 3, 4].forEach(() => {
            index = Math.round(Math.random() * (baseCharArr.length - 1));
            tArr.push(baseCharArr[index]);
            captchaStr += baseCharArr[index];
        })
        backFun(captchaStr);
        // const tArr = ['0', 'o', 'O', '2'];
        for (let i = 0; i < tArr.length; i++) {
            objArr.push({
                text: tArr[i],
                x: xArr[i],
                // x: getRandomNum() * 100,
                y: getRandomNum() * 5,
                r: getRandomNum() * 20,
            });
        }
        setTextProps(objArr);
    }, [])

    return (<TouchableOpacity
        onPress={() => {
            let objArr = [];
            let tArr = [];
            let index = 0;
            let captchaStr = '';
            [1, 2, 3, 4].forEach(() => {
                index = Math.round(Math.random() * (baseCharArr.length - 1));
                tArr.push(baseCharArr[index]);
                captchaStr += baseCharArr[index];
            })
            backFun(captchaStr);
            // const tArr = ['n', 'h', '1', '2'];
            for (let i = 0; i < tArr.length; i++) {
                objArr.push({
                    text: tArr[i],
                    x: xArr[i],
                    // x: getRandomNum() * 100,
                    y: getRandomNum() * 5,
                    r: getRandomNum() * 20,
                });
            }
            setTextProps(objArr);
        }}
    >
        <View
            style={[{
                width: 139,
                height: 44,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 22,
                borderColor: '#EAEBEE',
                borderWidth: 1
            }]}
        >
            <Surface width={95} height={44}>
                <Group width={95} height={44}>
                    {/* 1. 这里可以添加多个ART组件
                    2. 如果不写在Group内，那么只能添加一个ART组件 */}
                    <Shape
                        stroke={'#fff'}
                        strokeWidth={1}
                        d={new Path().moveTo(0, 0).lineTo(95, 0).lineTo(95, 44).lineTo(0, 44).close()}
                    />
                    {
                        textProps.map((item, index) => {
                            return (
                                <Text
                                    strokeWidth={1}
                                    stroke="#000"
                                    font="bold 35px Heiti SC"
                                    transform={new Transform().rotate(item.r, 8, 17).moveTo(item.x, item.y)}>
                                    {item.text}
                                </Text>
                            )
                        })
                    }
                    {/* <Text
                        strokeWidth={1}
                        stroke="#000"
                        font="bold 35px Heiti SC"
                        transform={new Transform().rotate(-10, 0, 0).moveTo(10, 0)}>1</Text>

                    <Text
                        strokeWidth={1}
                        stroke="#000"
                        font="bold 35px Heiti SC"
                        transform={new Transform().rotate(10, 0, 0).moveTo(30, 0)}>2</Text>
                    <Text
                        strokeWidth={1}
                        stroke="#000"
                        font="bold 35px Heiti SC"
                        transform={new Transform().rotate(10, 8, 17).moveTo(50, 0)}>4</Text>
                    <Text
                        strokeWidth={1}
                        stroke="#000"
                        font="bold 35px Heiti SC"
                        transform={new Transform().rotate(0, 8, 17).moveTo(70, 0)}>9</Text> */}
                </Group>
            </Surface>
        </View >
    </TouchableOpacity>)
}