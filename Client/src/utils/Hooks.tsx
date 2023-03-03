import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userProfileState } from "../Types/type";

export const useReplyToggle = () => {
  const [state, setState] = useState(false);
  const toggleReply = () => setState(!state);
  return [state, toggleReply] as const;
};

export const usePostToggle = (init = false) => {
  const [state, setState] = useState(init);
  const togglePost = () => setState((state) => !state);

  return [state, togglePost] as const;
};

export const useSelectPost = () => {
  const [state, setState] = useState<string>();
  const setPostId = (id: string | undefined) => setState(id);
  return [state, setPostId] as const;
};

export const useMobileSize = () => {
  const [windowSize, setWindowSize] = useState<undefined | number>();
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize && windowSize <= 1024;
};

export const useStyle = () => {
  interface style {
    border: string;
  }
  const [state, setState] = useState<style>();
  const mobilesize = useMobileSize();
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const mobileStyle = () => {
    setState({
      border: `.5px solid ${userProfile.website_accent}`,
    });
  };
  const monitorStyle = () => {
    setState({
      border: `1px solid ${userProfile.website_accent}`,
    });
  };
  useEffect(() => {
    setState({ border: `1px solid ${userProfile.website_accent}` });
  }, [userProfile]);

  useEffect(() => {
    mobilesize ? mobileStyle() : monitorStyle();
  }, [mobilesize]);
  return state;
};
