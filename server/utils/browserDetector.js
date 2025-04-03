import UAParser from 'ua-parser-js';

export const detectBrowser = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name,
    version: result.browser.version,
    os: result.os.name,
    device: result.device.type || 'desktop',
    isMobile: result.device.type === 'mobile',
    isTablet: result.device.type === 'tablet',
  };
};

export const isAllowedBrowser = (userAgent) => {
  const browserInfo = detectBrowser(userAgent);
  
  // Allow access without OTP for Microsoft browsers
  if (browserInfo.browser.toLowerCase().includes('edge') || 
      browserInfo.browser.toLowerCase().includes('ie')) {
    return true;
  }

  // Require OTP for Google Chrome
  if (browserInfo.browser.toLowerCase().includes('chrome')) {
    return false;
  }

  // Default to requiring OTP
  return false;
};

export const isAllowedTime = (userAgent) => {
  const browserInfo = detectBrowser(userAgent);
  const now = new Date();
  const hour = now.getHours();

  // Mobile device restrictions (10 AM to 1 PM)
  if (browserInfo.isMobile) {
    return hour >= 10 && hour < 13;
  }

  // Payment time restrictions (10 AM to 11 AM)
  if (hour < 10 || hour >= 11) {
    return false;
  }

  return true;
};

export const isAllowedVideoUploadTime = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 14 && hour < 19; // 2 PM to 7 PM
}; 