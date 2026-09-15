require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-star-io10"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-star-io10
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-star-io10"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-star-io10.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
  s.libraries    = "c++"
  s.pod_target_xcconfig = {
    'EXCLUDED_ARCHS[sdk=iphoneos*]' => 'x86_64',
    'EXCLUDED_SOURCE_FILE_NAMES[sdk=iphoneos*]' => '$(PODS_TARGET_SRCROOT)/ios/libs/StarIO10ReactNative.xcframework/ios-arm64_x86_64-simulator/*.*',
    'FRAMEWORK_SEARCH_PATHS[sdk=iphoneos*]' => '$(inherited) $(SRCROOT)/libs/** $(PODS_TARGET_SRCROOT)/ios/libs $(PODS_TARGET_SRCROOT)/ios/libs/StarIO10ReactNative.xcframework/ios-arm64_arm64e',
    'LIBRARY_SEARCH_PATHS' => '$(inherited) "$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)" "/usr/lib/swift"',
  }
  
  header_search_path_expo = [
    '$(SRCROOT)/../../node_modules/expo/**',
    # '$SRCROOT/../../node_modules/**',
  ]

  header_search_path_react_native = [
    # '$SRCROOT/../../node_modules/**',
  ]

  exclude_source_file_name = [
    'libs/StarIO10ReactNative.xcframework/ios-arm64_x86_64-simulator/StarIO10ReactNative.framework/Headers/*.h',
    'libs/StarIO10ReactNative.xcframework/ios-arm64_x86_64-simulator/StarIO10ReactNative.framework/PrivateHeaders/*.h'
  ]

  if ENV['USE_FRAMEWORKS']
    existing_xcconfig = s.to_hash["pod_target_xcconfig"] || {}
    existing_xcconfig.delete('EXCLUDED_SOURCE_FILE_NAMES[sdk=iphoneos*]')
    existing_headers = existing_xcconfig["HEADER_SEARCH_PATHS"] || ""
    existing_ldflags = existing_xcconfig["OTHER_LDFLAGS"] || "$(inherited)"

    if ENV['EXPO_MAIN_PROJECT_PATH']
      s.pod_target_xcconfig = existing_xcconfig.merge({
        "HEADER_SEARCH_PATHS" => "#{existing_headers} #{header_search_path_expo.join(" ")}".strip,
        "EXCLUDED_SOURCE_FILE_NAMES" => exclude_source_file_name.join(" "),
        "OTHER_LDFLAGS" => "#{existing_ldflags} -ObjC",
      })
    else
      s.pod_target_xcconfig = existing_xcconfig.merge({
        "HEADER_SEARCH_PATHS" => "#{existing_headers} #{header_search_path_react_native.join(" ")}".strip,
        "EXCLUDED_SOURCE_FILE_NAMES" => exclude_source_file_name.join(" "),
        "OTHER_LDFLAGS" => "#{existing_ldflags} -ObjC",
      })
    end
  end

  # ...
  # s.dependency "..."

  s.vendored_frameworks = 'ios/libs/StarIO10ReactNative.xcframework'
end

