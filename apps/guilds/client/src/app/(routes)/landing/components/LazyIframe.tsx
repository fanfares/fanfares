export interface LazyIframeProps {
  src: string;
  title: string;
}

function LazyIframe(props: LazyIframeProps){
  const { src, title } = props;
  return (
    <iframe
      className="mt-4 aspect-video w-[300px] md:w-[800px]"
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen></iframe>
  );
};

export default LazyIframe;
