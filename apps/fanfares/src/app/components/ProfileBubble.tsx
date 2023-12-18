"use client"

//TODO :
//  [] - CONFIG PROPS
//  [] - TEST ID'S

export function ProfileBuble() {
  return (
    <div className="flex bg-skin-fill rounded-full items-center w-full p-1 h-10 gap-1 hover:bg-skin-fill/70 transition-colors ease-linear cursor-pointer">
      <div className="w-8 bg-red-500 h-8 rounded-full">
        <img src="" alt="" />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-sm">User name</p>
        <p className="text-xs text-skin-muted">lud16</p>
      </div>
    </div>
  )
}
