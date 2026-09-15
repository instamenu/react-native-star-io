import {
    NativeModules
} from 'react-native';

import { NativeObject } from './NativeObject';
import { StarIO10ErrorFactory } from './StarIO10ErrorFactory';
import { MaintenanceInformationType } from './MaintenanceInformationType';

export class StarPrinterSettingMaintenance extends NativeObject {

    _printerIdentifier: string | undefined = undefined;

    async getInformation(): Promise<Map<MaintenanceInformationType, number>> {
        await this._initNativeObject();

        var information = await NativeModules.StarPrinterSettingMaintenanceWrapper.getInformation(this._nativeObject)
        .catch(async (nativeError: any) => {
            var error = await StarIO10ErrorFactory.create(nativeError.code);
            throw error;
        });

        var result = new Map<MaintenanceInformationType, number>();
        for (var key of Object.keys(information)) {
            result.set(key as MaintenanceInformationType, information[key]);
        }

        return result;
    }

    async resetInformation(types: Array<MaintenanceInformationType>): Promise<void> {
        await this._initNativeObject();

        await NativeModules.StarPrinterSettingMaintenanceWrapper.resetInformation(this._nativeObject, types)
        .catch(async (nativeError: any) => {
            var error = await StarIO10ErrorFactory.create(nativeError.code);
            throw error;
        });
    }

    async dispose(): Promise<void> {
        await this._initNativeObject();

        await this._disposeNativeObject();
    }

    protected async _initNativeObjectImpl(): Promise<string> {
        return await NativeModules.StarPrinterSettingMaintenanceWrapper.init(this._printerIdentifier);
    }
    protected async _disposeNativeObjectImpl(nativeObject: string): Promise<void> {
        await NativeModules.StarPrinterSettingMaintenanceWrapper.dispose(nativeObject);
    }
}
