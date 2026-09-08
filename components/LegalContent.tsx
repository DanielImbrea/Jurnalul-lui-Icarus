export default function LegalContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-editorial max-w-prose py-20 font-sans text-[15px] leading-relaxed text-mist [&>h2]:mt-10 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:text-bone [&>p]:mt-4 [&>ul]:mt-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&_strong]:text-bone [&_code]:rounded [&_code]:bg-bone/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-bone">
      {children}
    </div>
  );
}
