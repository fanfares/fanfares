
export function isMobileBrowser() {
  return /Mobi|Android/i.test(navigator.userAgent)
}

export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function getiOSVersion() {
  var match = navigator.userAgent.match(/OS (\d+)_\d+/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return null
}

export function detectIOSFirmware() {
  if (isiOS()) {
    var iosVersion = getiOSVersion()
    if (iosVersion == null) return null
    return iosVersion
  }
  return null
}