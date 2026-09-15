import { NativeObject } from './NativeObject';
import { StarPrinterSettingFirmware } from './StarPrinterSettingFirmware';
import { StarPrinterSettingMaintenance } from './StarPrinterSettingMaintenance';
export declare class StarPrinterSetting extends NativeObject {
    _printerIdentifier: string | undefined;
    _firmware: StarPrinterSettingFirmware | undefined;
    _maintenance: StarPrinterSettingMaintenance | undefined;
    get firmware(): StarPrinterSettingFirmware | undefined;
    get maintenance(): StarPrinterSettingMaintenance | undefined;
    dispose(): Promise<void>;
    protected _initNativeObjectImpl(): Promise<string>;
    protected _disposeNativeObjectImpl(nativeObject: string): Promise<void>;
}
