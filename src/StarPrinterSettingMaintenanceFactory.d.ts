import { StarPrinterSettingMaintenance } from './StarPrinterSettingMaintenance';
export declare class StarPrinterSettingMaintenanceFactory {
    static create(nativeMaintenance: string, nativeStarPrinter: string | undefined): Promise<StarPrinterSettingMaintenance | undefined>;
}
