/**
 * 获取维修项目列表数据 进行数据组装 将维修项目码表和已经维修的项目整合成一个维修项目列表
 * @param {*} EnumRepair 
 * @param {*} SubInfoList 
 */
export const GetRepairList=(EnumRepair,SubInfoList)=>{
  let list=[];
  for(let i=0;i<EnumRepair.length;i++){
    EnumRepair[i].Completed=false;
    EnumRepair[i].ItemName=EnumRepair[i].Name;
      for(let j=0;j<SubInfoList.length;j++){
          if(EnumRepair[i].ItemID==SubInfoList[j].ItemID){
            EnumRepair[i].Completed=true;//已维修的加上标识
            EnumRepair[i].RepairDescription=SubInfoList[j].RepairDescription;//已维修的描述
            EnumRepair[i].ChangeSpareparts=SubInfoList[j].ChangeSpareparts;//已维修的部件
            break;
          }
      }
      list.push(EnumRepair[i]);
  }
  return list;
};

/**
 * 获取巡检单据列表，进行数据组装，由于每个巡检项目的备注信息接口放到了主表中，而且是写死成Remark1-Remark7，前台需要取出来并且放到附表中（逻辑比较麻烦建议直接找编写人）
 * @param {*} RecordList 
 * @param {*} Code 
 * @param {*} MainInfo 
 */
export const GetPatrolList=(RecordList,Code,MainInfo)=>{
  let list=[];
  for(let i=0;i<Code.length;i++){
      let oldParent = Code[i];

      let newParent={
        Parent:oldParent.ParentName,
        Remark:typeof MainInfo['Remark'+(i+1)] =='undefine'?'':MainInfo['Remark'+(i+1)],
      };
      let newchildren = [];
      for(let j=0;j<oldParent.Children.length;j++){
        let oldChild = oldParent.Children[j];

        let newChild = {
          ItemID:oldChild.Childid,
          ItemName:oldChild.ChildName,
          MintenanceDescription:'',
        };
        for(let h=0;h<RecordList.length;h++){
          let dataChild = RecordList[h];
          if(dataChild.ItemID==newChild.ItemID){
            newChild.MintenanceDescription = dataChild.MintenanceDescription;
            break;
          }
        }
        newchildren.push(newChild);
      }
      newParent.Child = newchildren;
      list.push(newParent);
  }
  return list;
};


/**
 * 获取校验测试记录项目列表，进行数据组装，将已经填写的校验项目和码表里面的校验项目组装到一起进行展示
 * @param {*} RecordList 
 * @param {*} Code 
 * @param {*} MainInfo 
 */
export const GetBdList=(RecordList,Code)=>{
  let list=[];
  for(let i=0;i<Code.length;i++){
    //需要的实体
    let item = {
      ItemID:Code[i].ItemID,
      Name:Code[i].Name,
      Unit:"",
      Formula:"",
      EvaluateStadard:"",
      EvaluateResults:"",
      CbAvgValue:"",
      CemsTextValue:"",
      TestResult:"",
      IsComplete:false,
    };
    if(RecordList)
    for(let j=0;j<RecordList.length;j++){
      if(item.ItemID==RecordList[j].ItemID){
        item={...item,...RecordList[j]};
        item.IsComplete = true;
        break;
      }
    }
    list.push(item);
  }
  return list;
};


/**
 * 获取校验测试标气的码表，进行数据组装
 * @param {*} RecordList 
 * @param {*} Code 
 * @param {*} MainInfo 
 */
export const GetBdStandardGasCode=(standardGas)=>{
  let list=[];
  if(standardGas){
    for(let i=0;i<standardGas.length;i++){
      let gasName = standardGas[i].StandardGasName;
      let Manufacturers = standardGas[i].Manufacturer;
      for(let j=0;j<Manufacturers.length;j++){
        //标气的实体
        let item = {
          StandardGasName:gasName,
          Ndz:"",
          Manufacturer:Manufacturers[j].Manufacturer,
        };
        list.push(item);
      }
    } 
  }
  // [
  //   {
  //     "StandardGasName":"SO2 1",//标气名称
  //     "Ndz":"50",//浓度值
  //     "Manufacturer":"我是雪迪龙"//生产厂商
  //   },{
  //     "StandardGasName":"SO2 1",//标气名称
  //     "Ndz":"50",//浓度值
  //     "Manufacturer":"我是雪迪龙"//生产厂商
  //   }
  // ]
  return list;
};

/**
 * 获取校验测试设备的码表，进行数据组装
 * @param {*} RecordList 
 * @param {*} Code 
 * @param {*} MainInfo 
 */
export const GetBdEquipmentCode=(cbTestEquipment)=>{
  let list=[];
  if(cbTestEquipment){
    for(let i=0;i<cbTestEquipment.length;i++){
      let TestItem = cbTestEquipment[i].TestItem;//测试项目
      let TestEquipmentManufacturer = cbTestEquipment[i].TestEquipmentManufacturer;//企业 二级
      for(let j=0;j<TestEquipmentManufacturer.length;j++){
        let Manufacturer = TestEquipmentManufacturer[j].Manufacturer;//厂商名字
        let DetalList = TestEquipmentManufacturer[j].DetalList;
      for(let m=0;m<DetalList.length;m++){
        let item={
            TestItem:TestItem,
            Manufacturer:Manufacturer,
            TestEquipmenCode:DetalList[m].TestEquipmenCode,
            MethodBasis:DetalList[m].MethodBasis,
          };
          list.push(item);
        }
      }
    }
  }
  // [
  //   {
  //     "TestItem":"SO2",//设备测试项目
  //     "TestEquipmentManufacturer":"我是雪迪龙",//生产商
  //     "TestEquipmenCode":"415646",//设备型号
  //     "MethodBasis":"方法依据"//方法依据
  //   },{
  //     "TestItem":"SO2",//设备测试项目
  //     "TestEquipmentManufacturer":"我是雪迪龙",//生产商
  //     "TestEquipmenCode":"415646",//设备型号
  //     "MethodBasis":"方法依据"//方法依据
  //   }
  // ]
  return list;
};
