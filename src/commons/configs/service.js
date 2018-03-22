import moment from 'moment';
// import {FormMode} from 'wink_mobile_commons/dist/form/types';
import {values} from './';

const defaultPagination = {size: 'small', showSizeChanger:true, showQuickJumper: true};
const thisYear = moment().startOf('year');

export const service = {
    getValue: (obj, key, defaultValue) => {
        if(!obj) {
            return defaultValue;
        }
        if(!key) {
            return defaultValue;
        }

        const keys = key.split('.');
        let value = obj;
        for(let inx = 0, len = keys.length ; inx < len ; inx++) {
            let newValue = value[keys[inx]];
            if(!newValue) {
                return defaultValue;
            }
            value = newValue;
        }
        return value;
    },
};
export default {
    service
};
