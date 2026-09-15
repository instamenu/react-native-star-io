import { NativeModules } from 'react-native';
import { StarIO10UnknownError } from './StarIO10UnknownError';
import { StarPrinterSettingMaintenance } from './StarPrinterSettingMaintenance';

export class StarPrinterSettingMaintenanceFactory {
    static async create(nativeMaintenance: string, nativeStarPrinter: string | undefined): Promise<StarPrinterSettingMaintenance | undefined> {

        if (nativeMaintenance == null || nativeMaintenance === undefined) {
            return undefined;
        }

        var maintenance = new StarPrinterSettingMaintenance();

        try {
            maintenance._printerIdentifier = nativeStarPrinter;
        }
        catch(_) {
            throw new StarIO10UnknownError("Failed to create StarPrinterSettingMaintenance.");
        }
        finally {
            await NativeModules.StarPrinterSettingMaintenanceWrapper.dispose(nativeMaintenance);
        }

        return maintenance
    }
}
