interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle = (props: SectionTitleProps) => {
  return (
    <>
      {' '}
      <h2
        className={`font-font1 mx-auto w-40 text-center text-2xl font-gloock uppercase drop-shadow-2xl md:w-full md:text-center md:text-5xl ${props.className}`}>
        {props.title}
      </h2>
    </>
  );
};

export default SectionTitle;
