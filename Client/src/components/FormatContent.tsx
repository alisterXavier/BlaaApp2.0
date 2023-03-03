export const FormatContent = (content: string | undefined) => {
  const regex =
  /(https|http)?:\/\/[^\s]+/;
  const checkForUrl = (text: string) => {
    return regex.test(text);}

  return (
    <p className="text-start w-full h-30 whitespace-pre-line text-ellipsis overflow-hidden">
      {content?.split(" ").map((each) => {
        return checkForUrl(each) ? <a href={each} target="_blank" className="link" onClick={(e) => e.stopPropagation()}>{each}</a> : each;
      })}
    </p>
  );
};
