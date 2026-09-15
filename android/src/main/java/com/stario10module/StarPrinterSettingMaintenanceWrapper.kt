package com.stario10module

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactNoCrashSoftException
import com.facebook.react.bridge.ReadableArray
import com.starmicronics.stario10.MaintenanceInformationType
import com.starmicronics.stario10.StarIO10ArgumentException
import com.starmicronics.stario10.StarIO10Exception
import com.starmicronics.stario10.StarPrinter
import com.starmicronics.stario10.StarPrinterSettingMaintenance
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.lang.Exception

class StarPrinterSettingMaintenanceWrapper internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    override fun getName(): String {
        return "StarPrinterSettingMaintenanceWrapper"
    }

    @ReactMethod
    fun init(printerIdentifier: String, promise: Promise) {
        val printer = InstanceManager.get(printerIdentifier)

        if (printer is StarPrinter) {
            val maintenance = printer.setting?.maintenance
            val maintenanceIdentifier = InstanceManager.setNullable(maintenance)

            promise.resolve(maintenanceIdentifier)
        } else {
            promise.reject(ReactNoCrashSoftException("Not found $printerIdentifier identifier"))
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @ReactMethod
    fun getInformation(maintenanceIdentifier: String, promise: Promise) {
        val job = SupervisorJob()
        val scope = CoroutineScope(Dispatchers.Default + job)

        scope.launch {
            val maintenance = InstanceManager.get(maintenanceIdentifier)

            if (maintenance is StarPrinterSettingMaintenance) {
                try {
                    val information = maintenance.getInformationAsync().await()
                    val map = Arguments.createMap()
                    for ((type, value) in information) {
                        map.putInt(type.name, value)
                    }
                    promise.resolve(map)
                } catch (e: Exception) {
                    val exceptionIdentifier = InstanceManager.set(e)
                    promise.reject(exceptionIdentifier, e)
                }
            } else {
                promise.reject(StarIO10Exception("Identifier error"))
            }
        }
    }

    @ReactMethod
    fun resetInformation(maintenanceIdentifier: String, typeNames: ReadableArray, promise: Promise) {
        val job = SupervisorJob()
        val scope = CoroutineScope(Dispatchers.Default + job)

        scope.launch {
            val maintenance = InstanceManager.get(maintenanceIdentifier)

            if (maintenance is StarPrinterSettingMaintenance) {
                try {
                    val types = (0 until typeNames.size()).map { index ->
                        val name = typeNames.getString(index)
                        MaintenanceInformationType.values().firstOrNull { it.name == name }
                            ?: throw StarIO10ArgumentException("Invalid parameter.")
                    }

                    maintenance.resetInformationAsync(types).await()
                    promise.resolve(0)
                } catch (e: Exception) {
                    val exceptionIdentifier = InstanceManager.set(e)
                    promise.reject(exceptionIdentifier, e)
                }
            } else {
                promise.reject(StarIO10Exception("Identifier error"))
            }
        }
    }

    @ReactMethod
    fun dispose(maintenanceIdentifier: String, promise: Promise) {
        InstanceManager.remove(maintenanceIdentifier)
        promise.resolve(0)
    }
}
