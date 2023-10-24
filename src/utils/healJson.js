import Ajv from 'ajv';
import assume from './assume.js';
import getDeep from './getDeep.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const ajv = new Ajv();

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const healJson = (json, schema, options = {}) => {
    const {verbose = true} = options;
    const validate = ajv.compile(schema);
    const id = schema['$id'];
    let errorFingerprint = '';
    let errorCount = 0;

    while (true) {
        if (validate(json)) {
            // The json is now healed. Praise be!
            return json;
        }

        errorCount++;
        assume(errorCount < 1000, 'Too many errors!');

        const [error] = validate.errors; // we're only interested in the first error
        const freshFingerprint = JSON.stringify(error, null, 4);
        assume(errorFingerprint !== freshFingerprint, 'Repeated error!');
        errorFingerprint = freshFingerprint;

        // console.log('error: ' + JSON.stringify(error, null, 4));
        const {keyword, instancePath, params, schemaPath} = error;
        const instanceDotPath = standardizePath(instancePath);
        switch (keyword) {
            case 'enum': // fall-through
            case 'minLength': {
                const prop = schemaPath.match(/(\w+)\/\w+$/)[1];
                const completeAddress = id + schemaPath.replace(/\/\w+$/, '');
                const dataParentPath = instanceDotPath.replace(/\.\w+$/, '');
                const dataParent = getDeep(json, dataParentPath);
                const value = chooseValue(completeAddress);
                dataParent[prop] = value;
                verbose && console.warn(`Changed: ${dataParentPath}.${prop} = ${JSON.stringify(value)}`);
                break;
            }
            case 'type': {
                const match = instanceDotPath.match(/\[(\d+)]$|\.(\w+)$/);
                const key = match[1] || match[2];
                const dataParentPath = instanceDotPath.replace(/\[\d+]$|\.\w+$/, '');
                const dataParent = getDeep(json, dataParentPath);
                const completeAddress = id + schemaPath.replace(/\/\w+$/, '');
                const value = chooseValue(completeAddress);
                dataParent[key] = value === null ? {} : value;
                verbose && console.warn(`Changed: ${dataParentPath}.${key} = ${JSON.stringify(dataParent[key])}`);
                break;
            }
            case 'required': {
                const prop = params.missingProperty;
                const completeAddress = id + schemaPath.replace(/\w+$/, `properties/${prop}`);
                const dataParent = getDeep(json, instanceDotPath);
                const value = chooseValue(completeAddress);
                dataParent[prop] = value;
                verbose && console.warn(`Added: ${instanceDotPath}.${prop} = ${JSON.stringify(value)}`);
                break;
            }
            case 'additionalProperties': {
                const dataParent = getDeep(json, instanceDotPath);
                delete dataParent[params.additionalProperty];
                verbose && console.warn(`Removed: ${instanceDotPath}.${params.additionalProperty}`);
                errorCount--;
                break;
            }
            case 'minItems': {
                const dataParent = getDeep(json, instanceDotPath);
                const completeAddress = id + schemaPath.replace(/\w+$/, 'items');
                const itemsSchema = ajv.getSchema(completeAddress).schema;
                const defaultValue = itemsSchema.default || {};
                dataParent.push(defaultValue);
                const prop = `${instanceDotPath}.${dataParent.length - 1}`;
                verbose && console.warn(`Pushed: ${prop} = ${JSON.stringify(defaultValue)}`);
                break;
            }
            case 'const': // fall-through
            case 'minimum': // fall-through
            case 'maximum': {
                const prop = instanceDotPath.match(/\w+$/)[0];
                const dataParentPath = instanceDotPath.replace(/\.\w+$/, '');
                const dataParent = getDeep(json, dataParentPath);
                const completeAddress = id + schemaPath.replace(/\w+$/, '');
                const subSchema = ajv.getSchema(completeAddress).schema;
                dataParent[prop] = subSchema[keyword];
                verbose && console.warn(`Changed: ${prop} = ${subSchema[keyword]}`);
                break;
            }
            default: {
                console.warn('Unknown error!', errorFingerprint);
            }
        }
    }
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getSubSchema = (completeAddress) => {
    const subSchema = ajv.getSchema(completeAddress).schema;
    assume(subSchema, `Cannot find schema at ${completeAddress}!`);
    return subSchema;
};

/**
 *
 */
const chooseValue = (completeAddress) => {
    const {type, default: defaultValue} = getSubSchema(completeAddress);
    if (defaultValue === undefined) {
        switch (type) {
            case 'array':
                return [];
            case 'object':
                return {};
            case 'string':
                return '';
            case 'number':
                return 0;
            case 'boolean':
                return false;
            default:
                assume(false, `Missing default in ${completeAddress}!`);
                return;
        }
    }
    return defaultValue;
};

/**
 *
 */
const standardizePath = (path) => {
    path = path.replace(/^\//, '');
    path = path.replace(/\//g, '.');
    return path;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default healJson;
