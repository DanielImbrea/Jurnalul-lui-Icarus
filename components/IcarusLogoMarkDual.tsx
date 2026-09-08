type IcarusLogoMarkDualProps = {
  className?: string;
};

/** Logo dual — wine + ember, fundal transparent. Separat de logo-ul circular cu fundal crem. */
export default function IcarusLogoMarkDual({
  className = ""
}: IcarusLogoMarkDualProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 10c-14 6-26 20-30 36-2 8-1 17 3 24 8-6 17-10 27-12V10Z"
        fill="#5A1E2A"
      />
      <path
        d="M48 10c14 6 26 20 30 36 2 8 1 17-3 24-8-6-17-10-27-12V10Z"
        fill="#CDB56E"
      />
      <path
        d="M48 10v58"
        stroke="#EFEAE1"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M48 10 38 4M48 10 58 4"
        stroke="#EFEAE1"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M22 72c8-5 17-8 26-8s18 3 26 8"
        stroke="#EFEAE1"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.28"
      />
      <path
        d="M26 76c7-3 14-5 22-5s15 2 22 5"
        stroke="#CDB56E"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
