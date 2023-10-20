import AnimatedMenuButton from "./AnimatedButton"

interface NavigationMenuProps {
  onClick: () => void
}

export enum URL {
  home = "home",
}

const NavigationMenu = ({ onClick }: NavigationMenuProps) => {
  return (
    <div>
      <nav className="sticky top-0 flex-col items-start hidden gap-8 p-4 text-xl font-bold md:flex">
        <AnimatedMenuButton label="HOME" />
        <AnimatedMenuButton label="PROFILE" />
        <AnimatedMenuButton label="EXPLORE" />
        <AnimatedMenuButton label="SETTINGS" />
        <AnimatedMenuButton
          className="border border-blue-400"
          onClick={onClick}
          label="POST"
        />
      </nav>
    </div>
  )
}

export default NavigationMenu
