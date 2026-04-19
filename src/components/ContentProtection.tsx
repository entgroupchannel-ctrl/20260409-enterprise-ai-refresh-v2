import useContentProtection from "@/hooks/useContentProtection";

const ContentProtection = () => {
  useContentProtection(true);
  return null;
};

export default ContentProtection;
