import {
    NativeModules,
    NativeEventEmitter,
    type EventSubscription
} from 'react-native';

import { NativeObject } from './NativeObject';
import { StarPrinterSettingFirmware } from './StarPrinterSettingFirmware';
import { StarPrinterSettingMaintenance } from './StarPrinterSettingMaintenance';

export class StarPrinterSetting extends NativeObject {

    _printerIdentifier: string | undefined = undefined;
    _firmware: StarPrinterSettingFirmware | undefined = undefined;
    _maintenance: StarPrinterSettingMaintenance | undefined = undefined;

    get firmware(): StarPrinterSettingFirmware | undefined {
        return this._firmware;
    }

    get maintenance(): StarPrinterSettingMaintenance | undefined {
        return this._maintenance;
    }

    async dispose(): Promise<void> {
        await this._initNativeObject();

        await this._firmware?.dispose();
        this._firmware = undefined;

        await this._maintenance?.dispose();
        this._maintenance = undefined;

        await this._disposeNativeObject();
    }

    protected async _initNativeObjectImpl(): Promise<string> {
        return await NativeModules.StarPrinterSettingWrapper.init(this._printerIdentifier);
    }
    protected async _disposeNativeObjectImpl(nativeObject: string): Promise<void> {
        await NativeModules.StarPrinterSettingWrapper.dispose(nativeObject);
    } 
}