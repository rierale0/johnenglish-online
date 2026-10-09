type FacebookPixelArguments = [command: string, ...parameters: unknown[]];

interface FacebookPixel {
  (...args: FacebookPixelArguments): void;
  callMethod?: (...args: FacebookPixelArguments) => void;
  push: FacebookPixel;
  loaded: boolean;
  version: string;
  queue: FacebookPixelArguments[];
}

interface Window {
  fbq?: FacebookPixel;
  _fbq?: FacebookPixel;
}
