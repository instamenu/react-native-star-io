import React from 'react';
import { useState } from 'react';

import {
    View,
    ScrollView,
    Text,
    TextInput,
    PermissionsAndroid,
    Platform,
    Pressable,
    StyleSheet,
} from 'react-native';

import {
    InterfaceType,
    MaintenanceInformationType,
    StarConnectionSettings,
    StarPrinter
} from 'react-native-star-io10';

export default function App() {

    const [interfaceType, setInterfaceType] = useState(InterfaceType.Lan);
    const [identifier, setIdentifier] = useState("00:11:62:00:00:00");
    const [resetTypes, setResetTypes] = useState<Array<MaintenanceInformationType>>([]);
    const [statusText, setStatusText] = useState('\n');

    // The PowerOnTimeMin counter is permanent and cannot be reset, so it is not listed here.
    const resettableTypes = Object.values(MaintenanceInformationType).filter(
        (type) => type != MaintenanceInformationType.PowerOnTimeMin
    );

    function _toggleResetType(type: MaintenanceInformationType) {
        if (resetTypes.includes(type)) {
            setResetTypes(resetTypes.filter((value) => value != type));
        }
        else {
            setResetTypes([...resetTypes, type]);
        }
    }

    async function _onPressGetInformationButton() {
        var settings = new StarConnectionSettings();
        settings.interfaceType = interfaceType;
        settings.identifier = identifier;
        // settings.autoSwitchInterface = true;

        // If you are using Android 12 and targetSdkVersion is 31 or later,
        // you have to request Bluetooth permission (Nearby devices permission) to use the Bluetooth printer.
        // https://developer.android.com/about/versions/12/features/bluetooth-permissions
        if (Platform.OS == 'android') {
            if (interfaceType == InterfaceType.Bluetooth || settings.autoSwitchInterface == true) {
                var hasPermission = await _confirmBluetoothPermission();

                if (!hasPermission) {
                    console.log(`PERMISSION ERROR: You have to allow Nearby devices to use the Bluetooth printer`);
                    return;
                }
            }
            if (interfaceType == InterfaceType.BluetoothLE) {
                var hasPermission = await _confirmBluetoothLEPermission();

                if (!hasPermission) {
                    console.log(`PERMISSION ERROR: You have to allow Nearby devices to use the BluetoothLE printer`);
                    return;
                }
            }
        }

        var printer = new StarPrinter(settings);

        var newStatusText = '\n'
        setStatusText(newStatusText);

        try {
            await printer.open();

            var maintenance = printer.setting?.maintenance;

            if (maintenance == undefined){
                console.log(`printer.setting.maintenance is undefined. Unsupported Model.`);

                newStatusText =`printer.setting.maintenance is undefined. Unsupported Model.`;
                setStatusText(newStatusText);

                return;
            }

            var information = await maintenance.getInformation();

            // Information not supported by the printer is omitted from the returned data.
            newStatusText = '';
            for (var type of Object.values(MaintenanceInformationType)) {
                var value = information.get(type);
                newStatusText = newStatusText + `${type}: ${value != undefined ? String(value) : 'Not Supported'}\n`;
            }
            setStatusText(newStatusText);

            console.log(`Success`);
        }
        catch (error) {
            console.log(`Error: ${String(error)}`);

            newStatusText =
                newStatusText + `Error: ${String(error)}\n\n`

            setStatusText(newStatusText);
        }
        finally {
            await printer.close();
            await printer.dispose();
        }
    }

    async function _onPressResetInformationButton() {
        var settings = new StarConnectionSettings();
        settings.interfaceType = interfaceType;
        settings.identifier = identifier;
        // settings.autoSwitchInterface = true;

        // If you are using Android 12 and targetSdkVersion is 31 or later,
        // you have to request Bluetooth permission (Nearby devices permission) to use the Bluetooth printer.
        // https://developer.android.com/about/versions/12/features/bluetooth-permissions
        if (Platform.OS == 'android') {
            if (interfaceType == InterfaceType.Bluetooth || settings.autoSwitchInterface == true) {
                var hasPermission = await _confirmBluetoothPermission();

                if (!hasPermission) {
                    console.log(`PERMISSION ERROR: You have to allow Nearby devices to use the Bluetooth printer`);
                    return;
                }
            }
            if (interfaceType == InterfaceType.BluetoothLE) {
                var hasPermission = await _confirmBluetoothLEPermission();

                if (!hasPermission) {
                    console.log(`PERMISSION ERROR: You have to allow Nearby devices to use the BluetoothLE printer`);
                    return;
                }
            }
        }

        var printer = new StarPrinter(settings);

        var newStatusText = '\n'
        setStatusText(newStatusText);

        try {
            await printer.open();

            var maintenance = printer.setting?.maintenance;

            if (maintenance == undefined){
                console.log(`printer.setting.maintenance is undefined. Unsupported Model.`);

                newStatusText =`printer.setting.maintenance is undefined. Unsupported Model.`;
                setStatusText(newStatusText);

                return;
            }

            newStatusText = `Reset: ${resetTypes.join(', ')}\n\n`;
            setStatusText(newStatusText);

            // Once maintenance information has been reset, it cannot be restored.
            await maintenance.resetInformation(resetTypes);

            newStatusText = newStatusText + `Success\n`;
            setStatusText(newStatusText);

            console.log(`Success`);
        }
        catch (error) {
            console.log(`Error: ${String(error)}`);

            newStatusText =
                newStatusText + `Error: ${String(error)}\n\n`

            setStatusText(newStatusText);
        }
        finally {
            await printer.close();
            await printer.dispose();
        }
    }

    async function _confirmBluetoothPermission(): Promise<boolean> {
        var hasPermission = false;

        try {
            if (Number(Platform.Version) >= 31) {
                hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);

                if (!hasPermission) {
                    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);

                    hasPermission = status == PermissionsAndroid.RESULTS.GRANTED;
                }
            } else {
                hasPermission = true;
            }
        }
        catch (err) {
            console.warn(err);
        }

        return hasPermission;
    }

    async function _confirmBluetoothLEPermission(): Promise<boolean> {
        var hasPermission = false;

        try {
            if (Number(Platform.Version) >= 31) {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                ];

                const results = await PermissionsAndroid.requestMultiple(permissions);

                hasPermission = permissions.every(
                    (perm) => results[perm] === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ];

                const results = await PermissionsAndroid.requestMultiple(permissions);

                hasPermission = permissions.every(
                    (perm) => results[perm] === PermissionsAndroid.RESULTS.GRANTED
                );
            }

        }
        catch (err) {
            console.warn(err);
        }

        return hasPermission;
    }

    const styles = StyleSheet.create({
        activeButton: {
            margin: 5,
            width: 220,
            alignItems: 'center',
            backgroundColor: '#0026FF',
            padding: 10,
        },
        inactiveButton: {
            margin: 5,
            width: 220,
            alignItems: 'center',
            backgroundColor: '#606060',
            padding: 10,
        },
        buttonText: {
            color: '#FFFFFF',
        }
    });
    return (
        <View style={{ margin: 10, marginTop: 50, marginBottom: 50, flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100 }}>Interface</Text>
                <View style={{ margin: 10 }}>
                    <Pressable
                        style={interfaceType == InterfaceType.Lan ? styles.activeButton : styles.inactiveButton}
                        onPress={() =>
                            setInterfaceType(InterfaceType.Lan)
                        }>
                        <Text style={styles.buttonText}>Lan</Text>
                    </Pressable>
                    <Pressable
                        style={interfaceType == InterfaceType.Bluetooth ? styles.activeButton : styles.inactiveButton}
                        onPress={() =>
                            setInterfaceType(InterfaceType.Bluetooth)
                        }>
                        <Text style={styles.buttonText}>Bluetooth</Text>
                    </Pressable>
                    <Pressable
                        style={interfaceType == InterfaceType.BluetoothLE ? styles.activeButton : styles.inactiveButton}
                        onPress={() =>
                            setInterfaceType(InterfaceType.BluetoothLE)
                        }>
                        <Text style={styles.buttonText}>BluetoothLE</Text>
                    </Pressable>
                    <Pressable
                        style={interfaceType == InterfaceType.Usb ? styles.activeButton : styles.inactiveButton}
                        onPress={() =>
                            setInterfaceType(InterfaceType.Usb)
                        }>
                        <Text style={styles.buttonText}>USB</Text>
                    </Pressable>
                </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <Text style={{ width: 100 }}>Identifier</Text>
                <TextInput
                    style={{ width: 200, marginLeft: 20 }}
                    value={identifier}
                    onChangeText={(value) => {
                        setIdentifier(value);
                    }}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <Pressable
                    style={styles.activeButton}
                    onPress={() => _onPressGetInformationButton()
                    }>
                    <Text style={styles.buttonText}>getInformation()</Text>
                </Pressable>
            </View>

            <View style={{ marginTop: 20 }}>
                <Text>Reset target</Text>
                {resettableTypes.map((type) => (
                    <Pressable
                        key={type}
                        style={resetTypes.includes(type) ? styles.activeButton : styles.inactiveButton}
                        onPress={() => _toggleResetType(type)
                        }>
                        <Text style={styles.buttonText}>{type}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={{ marginTop: 10 }}>
                <Pressable
                    style={styles.activeButton}
                    onPress={() => _onPressResetInformationButton()
                    }>
                    <Text style={styles.buttonText}>resetInformation()</Text>
                </Pressable>
            </View>

            <View style={{ flex: 1, alignSelf: 'stretch', marginTop: 20 }}>
                <ScrollView>
                    <Text>{statusText}</Text>
                </ScrollView>
            </View>
        </View>
    );
};
