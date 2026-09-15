import { NativeObject } from './NativeObject';
import { MaintenanceInformationType } from './MaintenanceInformationType';
export declare class StarPrinterSettingMaintenance extends NativeObject {
    _printerIdentifier: string | undefined;
    getInformation(): Promise<Map<MaintenanceInformationType, number>>;
    resetInformation(types: Array<MaintenanceInformationType>): Promise<void>;
    dispose(): Promise<void>;
    protected _initNativeObjectImpl(): Promise<string>;
    protected _disposeNativeObjectImpl(nativeObject: string): Promise<void>;
}
