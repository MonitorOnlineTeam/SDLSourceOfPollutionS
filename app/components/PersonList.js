import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { StatusPage, SDLText, AlertDialog, SimpleLoadingView, } from '../components';
import { SCREEN_WIDTH } from '../config/globalsize';
import globalcolor from '../config/globalcolor';
import { EmptyView } from './StatusPages/EmptyView';
import { ShowToast, createAction } from '../utils';

import FormInput from '../operationContainers/taskViews/taskExecution/components/FormInput';
// 本地图片引入
const checkedIcon = require('../images/duoxuanxuanzhong.png');
const uncheckedIcon = require('../images/duoxuankuang.png');
const PersonList = (props) => {

  const dispatch = useDispatch();
  const { key = 'User_ID', textKey = 'title', route:{ params },} = props;

  const [status, setStatus] = useState(-1); //-1 加载状态  0 无数据

  const [selectedVals, setSelectedVals] = useState(params?.params.selectUser || []);
  const [selectedIds, setSelectedIds] = useState([]); //删除

  const [searchText, setSearchText] = useState('');
  const sectionListRef = useRef(null);
  const [sections, setSections] = useState([]);
  const [addNameText, setAddNameText] = useState('');
  // 字母索引生成
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );


  const delAlertRef = useRef(null);
  const addAlertRef = useRef(null);

  useEffect(() => {
    loadData()

  }, [])
  useEffect(() => {
    if (sections?.[0]) {
      props.navigation.setOptions({
        headerRight: () => <TouchableOpacity
          onPress={() => {
            if (selectedIds?.[0]) {
              delAlertRef.current?.show(); // 调用子组件暴露的方法 
            } else {
              ShowToast('请选择要删除的人员')
            }

          }}
        >
          <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>删除</SDLText>
        </TouchableOpacity>
      });
    }

  }, [sections, selectedIds])



  const loadData = (callback) => {
    dispatch(createAction('patrolModelBw/GetOperationUserBW')({
      params: { userName: '' },
      callback: result => {
        setStatus(result.status)
        if (result.status == 200) {
          setSections(result.data?.Datas)
        }
        callback && callback()
      },
    }),
    );
  }

  // 搜索过滤
  const filteredData = sections
    .map(section => ({
      ...section,
      data: section.data.filter(item =>
        item[textKey].includes(searchText)
      )
    }))
    .filter(section => section.data.length > 0);


  // 处理添加
  const handleAdd = () => {
    addAlertRef.current?.show();
    setAddNameText('')
  };
  // 处理保存
  const handleSave = () => {
    const { callback } = params?.params;

    const selectedNames = sections
      .flatMap(s => s.data)
      .filter(item => selectedVals.includes(item[textKey]))
      .map(item => item[textKey])
      .join(',');

      callback && callback(selectedNames)
      props.navigation.goBack();
  };

  // 滚动到指定字母
  const scrollToLetter = (letter) => {
    const sectionIndex = filteredData.findIndex(s => s.key === letter);
    if (sectionIndex > -1) {
      sectionListRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        viewOffset: 0,
        animated: true
      });
    }
  };


  const delOptions = (id) => ({
    headTitle: '提示',
    messText: `确定要删除选中的人员`,
    headStyle: {
      backgroundColor: globalcolor.headerBackgroundColor,
      color: '#ffffff',
      fontSize: 18,
    },
    buttons: [
      {
        txt: '取消',
        btnStyle: { backgroundColor: 'transparent' },
        txtStyle: { color: globalcolor.headerBackgroundColor },
        onpress: () => { },
      },
      {
        txt: '确定',
        btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
        txtStyle: { color: '#ffffff' },
        onpress: () => {

        },
      },
    ],
    submitCallback: () => {
      setStatus(-1)
      dispatch(createAction('patrolModelBw/DelOperationUserBW')({
        params: { idList: selectedIds },
        callback: result => {
          setStatus(result.status)
          if (result.status == 200) {
            ShowToast('删除成功');
            loadData()
          }

        }
      }))
    }
  });
  const addOptions = () => ({
    hiddenTitle: true,
    innersHeight: 200,
    headStyle: {
      backgroundColor: globalcolor.headerBackgroundColor,
      color: '#ffffff',
      fontSize: 18,
    },
    buttons: [
      {
        txt: '取消',
        btnStyle: { backgroundColor: 'transparent' },
        txtStyle: { color: globalcolor.headerBackgroundColor },
        onpress: () => { },
      },
      {
        txt: '确定',
        btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
        txtStyle: { color: '#ffffff' },
        onpress: () => {


        },
      },
    ],
    submitCallback: () => {
      function isTitleDuplicate(data, newTitle) {
        const titleSet = new Set();
        // 遍历所有分组的数据
        data.forEach(group => {
          group.data.forEach(item => titleSet.add(item.title));
        });
        return titleSet.has(newTitle); // 存在返回 true
      }
      if (isTitleDuplicate(sections, addNameText)) {
        ShowToast("已存在同样的用户名，无法添加");
        return;
      }
      setStatus(-1)
      dispatch(createAction('patrolModelBw/AddOperationUserBW')({
        params: { name: addNameText },
        callback: result => {
          setStatus(result.status)
          if (result.status == 200) {
            ShowToast('添加成功');
            loadData()
          }

        }
      }))
    }
  });
  return (<StatusPage
    status={status}
    //页面是否有回调按钮，如果不传，没有按钮，
    emptyBtnText={'重新请求'}
    errorBtnText={'点击重试'}
    onEmptyPress={() => {
      //空页面按钮回调
      loadData();
    }}
    onErrorPress={() => {
      //错误页面按钮回调
      loadData();
    }}
  >
    <View style={styles.container}>

      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="人员名称"
          placeholderTextColor='#999'
          value={searchText}
          onChangeText={setSearchText}
        />
        {/* <TouchableOpacity style={styles.searchButton} onPress={()=>{
          setSearchText
        }}>
          <Text style={styles.buttonText}>搜索</Text>
        </TouchableOpacity>  */}
      </View>
      <SectionList
        ref={sectionListRef}
        sections={filteredData}
        keyExtractor={item => item[key].toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }} // 按钮纵向的空间
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              setSelectedVals(prev =>
                prev.includes(item[textKey])
                  ? prev.filter(val => val !== item[textKey])
                  : [...prev, item[textKey]]
              );
              setSelectedIds(prev =>
                prev.includes(item[key])
                  ? prev.filter(val => val !== item[key])
                  : [...prev, item[key]]
              )
            }

            }
          >
            <Image
              source={selectedVals.includes(item[textKey]) ? checkedIcon : uncheckedIcon}
              style={styles.checkbox}
            />
            <Text style={styles.name}>{item[textKey]}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.key}</Text>
          </View>
        )}
        ListEmptyComponent={
          <EmptyView
            title={'暂无数据'}
            paddingTop={100}
          />
        }
      />

      {/* 右侧字母索引 */}
      {filteredData?.[0] && <View style={styles.alphabetIndex}>
        {alphabet.map(letter => (
          <TouchableOpacity
            key={letter}
            onPress={() => scrollToLetter(letter)}
            style={styles.indexItem}
          >
            <Text style={styles.indexLetter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>}

      {/* 底部添加按钮 */}
      <View style={styles.operateBtn}>
       <TouchableOpacity
          style={styles.btn}
          onPress={handleAdd}
        >
          <Text style={styles.buttonText}>添加</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>
      </View>
      <AlertDialog options={delOptions()} ref={delAlertRef} />
      <AlertDialog
        options={addOptions()} ref={addAlertRef}
        components={
          <View
            style={{
              height: 45,
              width: 280,
              backgroundColor: 'white'
            }}
          >
            <FormInput
              label={'人员名称'}
              placeholder="请输入"
              required={true}
              value={addNameText}
              onChangeText={(value) => {
                setAddNameText(value)
              }}
            />
          </View>
        }
      />

    </View>
  </StatusPage>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  name: {
    fontSize: 14,
    color: '#444'
  },
  sectionHeader: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  alphabetIndex: {
    position: 'absolute',
    right: 8,
    top: 70,
    transform: [{ translateY: - 10 }],
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
    paddingVertical: 8
  },
  indexItem: {
    paddingVertical: 2
  },
  indexLetter: {
    fontSize: 12,
    color: '#2196F3',
    paddingHorizontal: 6
  },
  operateBtn: {
    position: 'absolute',
    bottom: 12,
    left: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingVertical: 12,
    elevation: 3,
    marginRight: 12,
    width: SCREEN_WIDTH / 2 - 40

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default PersonList;