#import "StarPrinterSettingMaintenanceWrapper.h"
#import <React/RCTLog.h>
#import "StarObjectManager.h"
#import "StarIO10ValueConverter.h"
@import StarIO10ReactNative;


@interface StarPrinterSettingMaintenanceWrapper()

@property(assign, nonatomic) StarObjectManager *objManager;

@end

@implementation StarPrinterSettingMaintenanceWrapper

- (instancetype)init
{
    self = [super init];
    if (self) {
        _objManager = StarObjectManager.sharedManager;
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(init,
                 initWithObjectIdentifier:(nonnull NSString *)printerObjID
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    STARIO10StarPrinter *printer = [_objManager getObject:printerObjID];

    if (printer == nil) {
        reject(@"Error", @"Fail to get object.", nil);
        return;
    }

    STARIO10StarPrinterSettingMaintenance *maintenance = printer.setting.maintenance;

    if (maintenance == nil) {
        resolve(nil);
        return;
    }

    NSString *objID = [_objManager add:maintenance];
    resolve(objID);
}

RCT_REMAP_METHOD(dispose,
                 disposeWithNativeObject:(nonnull NSString *)objID
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [_objManager remove:objID];
    resolve(nil);
}

#pragma mark -

RCT_REMAP_METHOD(getInformation,
                 getInformationWithObjectIdentifier:(nonnull NSString *)maintenanceObjID
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    STARIO10StarPrinterSettingMaintenance *maintenance = [_objManager getObject:maintenanceObjID];

    if (maintenance == nil) {
        reject(@"Error", @"Fail to get object.", nil);
        return;
    }

    [maintenance getInformationWithCompletion:^(NSDictionary<NSNumber *, NSNumber *> *information, NSError *error) {
        if (error) {
            NSString *errorID = [self->_objManager add:error];
            reject(errorID, error.localizedDescription, error);
            return;
        }

        NSMutableDictionary<NSString *, NSNumber *> *result = [[NSMutableDictionary alloc] init];
        for (NSNumber *key in information) {
            NSString *name = [StarIO10ValueConverter toStringFromMaintenanceInformationType:key.integerValue];
            if (name != nil) {
                result[name] = information[key];
            }
        }
        resolve(result);
    }];
}

RCT_REMAP_METHOD(resetInformation,
                 resetInformationWithObjectIdentifier:(nonnull NSString *)maintenanceObjID
                 types:(nonnull NSArray<NSString *> *)typeNames
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    STARIO10StarPrinterSettingMaintenance *maintenance = [_objManager getObject:maintenanceObjID];

    if (maintenance == nil) {
        reject(@"Error", @"Fail to get object.", nil);
        return;
    }

    NSMutableArray<NSNumber *> *types = [[NSMutableArray alloc] init];
    for (NSString *name in typeNames) {
        [types addObject:@([StarIO10ValueConverter toMaintenanceInformationTypeValue:name])];
    }

    [maintenance resetInformation:types completion:^(NSError *error) {
        if (error) {
            NSString *errorID = [self->_objManager add:error];
            reject(errorID, error.localizedDescription, error);
        } else {
            resolve(nil);
        }
    }];
}

@end
