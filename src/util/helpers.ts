export const anchorLink = (url: string, newTab: boolean) => {
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  if (newTab) {
    link.target = "_blank";
  }
  document.body.appendChild(link);
  link.click();
};
