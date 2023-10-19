import AnimatedButton from "./AnimatedButton"

interface NavigationMenuProps {
  onClick: () => void
}

const NavigationMenu = ({ onClick }: NavigationMenuProps) => {
  return (
    <div>
      <nav className="sticky top-0 flex-col items-start hidden gap-8 p-4 text-xl font-bold md:flex">
        <AnimatedButton label="HOME" />
        <AnimatedButton label="PROFILE" />
        <AnimatedButton label="EXPLORE" />
        <AnimatedButton label="SETTINGS" />
        <AnimatedButton
          className="border border-blue-400"
          onClick={onClick}
          label="POST"
        />
      </nav>
    </div>
  )
}

export default NavigationMenu
