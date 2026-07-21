import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const NetworkEthereumIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={33} fill="none" viewBox="0 0 32 33" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<circle cx={16} cy={16.793} r={16} fill="url(#a)" /><path fill="#9159FF" d="M16 32.793c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16" /><path fill="#fff" d="M16 7.193v13.262L9.6 16.97z" /><path fill="#fff" d="m16 7.193 6.4 9.778-6.4 3.483zM16 21.57v4.823L9.6 18.09zM16 26.393v-4.822l6.4-3.482z" /><defs><linearGradient id="a" x1={1.136} x2={31.804} y1={16.794} y2={40.794} gradientUnits="userSpaceOnUse"><stop stopColor="#6580EB" /><stop offset={1} stopColor="#8EA2F2" /></linearGradient></defs></svg>;
export { NetworkEthereumIcon };