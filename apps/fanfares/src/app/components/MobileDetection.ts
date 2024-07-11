
export function isMobileBrowser() {
  if (typeof navigator === 'undefined') return null;
  return /Mobi|Android/i.test(navigator.userAgent)
}

export function isiOS() {
  if (typeof navigator === 'undefined') return null;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function getiOSVersion() {
  if (typeof navigator === 'undefined') return null;
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