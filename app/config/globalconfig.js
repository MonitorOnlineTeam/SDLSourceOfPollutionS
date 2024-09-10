import { registerModels as registerModels_air } from '../airModels';
import { registerModels as registerModels_operation } from '../operationModels';
import { registerModels as registerModels_water } from '../waterModels';
import { registerModels as registerModels_grid } from '../gridModels';
import { registerModels as registerModels_gridOperation } from '../gridOperationModels';
import { registerModels as registerModels_pollution } from '../pollutionModels';
import { registerModels as registerModels_pollution_operation } from '../pOperationModels';

import AirProjectNavigator from '../airContainers';
import OperatinNavigator from '../operationContainers';
import WaterNavigator from '../waterContainers';
import GridNavigator from '../gridContainers';
import GridOperationNavigator from '../gridOperationContainers';

import PollutionNavigator from '../pollutionContainers';
import PollutionOperaionNavigator from '../pOperationContainers';

import baseModel from '../models/model';

import { CURRENT_PROJECT } from './globalconst';
import { from } from 'rxjs';
/**
 * 注册路由
 */
export const registerModels = app => {
    app.model(baseModel);
    if (CURRENT_PROJECT == 'AIR_PROJECT') {
        registerModels_air(app);
    } else if (CURRENT_PROJECT == 'ORERATION') {
        registerModels_operation(app);
    } else if (CURRENT_PROJECT == 'WATER_PROJECT') {
        registerModels_water(app);
    } else if (CURRENT_PROJECT == 'GRID_PROJECT') {
        registerModels_grid(app);
    } else if (CURRENT_PROJECT == 'POLLUTION_PROJECT') {
        registerModels_pollution(app);
    } else if (CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT') {
        registerModels_pollution_operation(app);
    } else if (CURRENT_PROJECT == 'GRID_ORERATION_PROJECT') {
        registerModels_gridOperation(app);
    }
};

/**
 * 获取根路由
 */
export const getRootNavigator = () => {
    if (CURRENT_PROJECT == 'AIR_PROJECT') {
        return AirProjectNavigator;
    } else if (CURRENT_PROJECT == 'ORERATION') {
        return OperatinNavigator;
    } else if (CURRENT_PROJECT == 'WATER_PROJECT') {
        return WaterNavigator;
    } else if (CURRENT_PROJECT == 'GRID_PROJECT') {
        return GridNavigator;
    } else if (CURRENT_PROJECT == 'GRID_ORERATION_PROJECT') {
        return GridOperationNavigator;
    } else if (CURRENT_PROJECT == 'POLLUTION_PROJECT') {
        return PollutionNavigator;
    } else if (CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT') {
        return PollutionOperaionNavigator;
    }
};

global.constants = {
    isSecret: false,
    name: '百度'
};
