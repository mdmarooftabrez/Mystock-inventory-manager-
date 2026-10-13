function Brand() {
  return (
    <span className="inline-flex items-center gap-3">
      <img src="/mystock.svg" alt="" className="h-9 w-9" />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight">MyStock</span>
        <span className="mt-0.5 text-[10px] font-medium opacity-70">Product &amp; Inventory Manager</span>
      </span>
    </span>
  );
}

export default Brand;
