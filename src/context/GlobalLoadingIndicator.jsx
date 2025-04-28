import { useLoading } from "./LoadingContext";

const GlobalLoadingIndicator = () => {
  const { isLoading, setIsLoading, message } = useLoading();
  const { title, heading, body, close } = message;

  return (
    <div
      className={`${
        isLoading ? "fixed backdrop-blur-sm" : "hidden backdrop-blur-none"
      } inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-200 ease-in-out`}
    >
      <div
        className={`${
          isLoading ? "flex opacity-0" : "hidden opacity-100"
        }bg-backgroundc rounded-lg shadow-lg flex-col h-[min(40%,400px)] w-[min(70%,400px)] overflow-hidden`}
      >
        <div className="flex p-[min(3vw,50px)]">
          <span className="text-textc font-bold text-subheading">
            {title || "Loading"}
          </span>
        </div>
        <div className="h-full p-[min(3vw,50px)] ">
          {heading ? (
            <div className="pl-[min(3vw,50px)] font-light flex gap-[10px]">
              <span className="animate-spin">|</span>
              <span className="animate-pulse">{heading || "Please Wait"}</span>
            </div>
          ) : null}
          <div className="h-[10%]"></div>
          <span className="text-borderc pl-[min(3vw,50px)]">
            {body || null}
          </span>
        </div>
        <div className="p-[min(3vw,50px)] flex items-center justify-center">
          {close ? (
            <button
              onClick={() => setIsLoading(false)}
              className="border-1 border-borderc p-[min(1vw,10px)] px-[min(2vw,30px)] rounded-sm cursor-pointer"
            >
              Ok
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export { GlobalLoadingIndicator };
