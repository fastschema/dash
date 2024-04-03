export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const titleCase = (str: string) => {
  const splitStr = str.toLowerCase().split(' ');

  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }

  return splitStr.join(' ');
}

export const slugToTitle = (str: string) => {
  return titleCase(str.replace(/[-_]/g, ' '));
}
