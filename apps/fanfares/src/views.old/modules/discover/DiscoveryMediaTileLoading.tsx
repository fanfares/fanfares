function DiscoveryMediaTileLoading() {
  return (
    <div className="flex w-[340px] flex-col md:h-64 md:w-40">
      <div className="CONTAINER flex h-32 w-full animate-pulse gap-2 rounded-lg bg-gray-500 p-2 md:h-64 md:flex-col">
        <div className="IMAGE h-20 w-20 animate-pulse rounded-lg bg-gray-400 p-4 md:h-36 md:w-36 " />
        <div className="space-y-2 md:flex md:flex-col">
          <div className="TITLE h-3 w-[240px] animate-pulse rounded-lg bg-gray-400 p-4 md:h-2 md:w-36 " />
          <div className="DESCRIPTION h-16 w-[240px] animate-pulse rounded-lg bg-gray-400 md:top-48 md:h-12 md:w-36" />
        </div>
      </div>
    </div>
  );
}

export default DiscoveryMediaTileLoading;
