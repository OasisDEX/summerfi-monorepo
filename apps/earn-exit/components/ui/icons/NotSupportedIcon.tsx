import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const NotSupportedIcon = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path d="M.96.296A.42.42 0 0 0 .627.16h.001-.326A.03.03 0 0 0 .27.192v.896c0 .018.014.032.032.032h.326A.42.42 0 0 0 .96.984a.5.5 0 0 0 .119-.345V.64A.5.5 0 0 0 .96.296l.001.001zM.371.261h.256a.32.32 0 0 1 .257.103.4.4 0 0 1 .092.277V.64a.4.4 0 0 1-.093.276L.884.915a.32.32 0 0 1-.258.103h.001-.256z" /></svg>;
export { NotSupportedIcon };