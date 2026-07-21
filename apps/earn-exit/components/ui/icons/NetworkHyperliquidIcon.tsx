import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const NetworkHyperliquidIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" viewBox="0 0 32 32" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#97fce4" d="M29.67 15.873c0 9.039-5.53 11.94-8.446 9.357-2.399-2.106-3.112-6.556-6.721-7.013-4.58-.576-4.977 5.523-7.99 5.523-3.51 0-4.184-5.106-4.184-7.728 0-2.682.754-6.338 3.747-6.338 3.49 0 3.688 5.225 8.05 4.947 4.342-.298 4.422-5.742 7.237-8.066 2.459-2.006 8.308.159 8.308 9.318z" style={{
    strokeWidth: 0.189874
  }} /></svg>;
export { NetworkHyperliquidIcon };