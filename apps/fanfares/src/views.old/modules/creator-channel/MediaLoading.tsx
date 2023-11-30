import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';

function MediaLoading() {
  return (
    <div className="relative flex w-full flex-col gap-8 ">
      <hr className="mt-4 w-full animate-pulse  border-buttonDisabled bg-gray-500" />
      <div className="flex md:justify-between">
        <div className=" relative  h-[70px] w-[70px] min-w-fit animate-pulse bg-gray-500"></div>
        <div className="ml-4 flex flex-col md:w-[70%]">
          <a className=" animate-pulse bg-gray-500 text-sm font-bold line-clamp-1"></a>

          <p className="animate-pulse bg-gray-500 text-sm font-thin line-clamp-3"></p>
        </div>
        <div className="ml-auto flex flex-row items-center justify-between gap-x-8">
          <button className="animate-pulse bg-gray-500">
            <FontAwesomeIcon
              className="text-xl transition-all hover:text-buttonAccentHover md:text-4xl"
              icon={FAProSolid.faCirclePlay}
            />
          </button>
          <div className=" flex w-20 flex-col items-end text-right text-xs ">
            <p className="animate-pulse bg-gray-500 text-base font-bold text-skin-inverted"></p>
            <p className="w-full animate-pulse bg-gray-500 text-skin-inverted"></p>
            <p className="animate-pulse bg-gray-500"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaLoading;
