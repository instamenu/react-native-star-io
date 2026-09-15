- [English](../README.md)

# Example - react-native-star-io10

本サンプルは以下機能を含みます。

* [印刷](../samples/printing/App.tsx) - プリンターで印刷
* [印刷（スプーラー）](../samples/printing_spooler/App.tsx) - プリンターのスプーラー機能を利用して印刷
* [テンプレート印刷](../samples/template_print/App.tsx) - テンプレート印刷機能を利用して印刷
* [印刷データのサンプル](../samples/printing_samples/README.md) - 各業態のレシートやラベル用印刷サンプル（サンプルコードと印刷結果画像）
* [検索](../samples/discovery/App.tsx) - デバイスの検索
* [ステータス](../samples/status/App.tsx) - デバイスのステータスを取得
* [監視](../samples/monitor/App.tsx) - デバイスを監視
* [ファームウェア更新](../samples/firmware_update/App.tsx) - プリンターのファームウェアを更新
* [メンテナンス情報](../samples/maintenance/App.tsx) - プリンターのメンテナンス情報の取得と初期化

## 使用方法

以下は`印刷`機能の例です。

```
yarn install
cp samples/printing(or another function)/App.tsx ./
```

### iOS

```bash
cd ios
pod update
cd ..
npx react-native run-ios
```

### Android

```
npx react-native run-android
```